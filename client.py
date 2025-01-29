"""MuseScore.com API client."""

import tempfile
import requests
import json
from pathlib import Path

from tqdm import tqdm

from msczpy import TEST_SCORE_PATH, MsczFileManager
from mxlpy import export_mscz
from mxlpy.clean_xml import reduce_file
from mxlpy.util import Paths, check_all_yt_sources

MUSESCORECOM_API_ROOT_URL = "https://desktop.musescore.com/editor/v1"
MUSESCORECOM_URL = "https://musescore.com"
MUSESCORECOM_USER_INFO_URL = f"{MUSESCORECOM_API_ROOT_URL}/me"
MUSESCORECOM_SCORE_INFO_URL = f"{MUSESCORECOM_API_ROOT_URL}/score/info"
MUSESCORECOM_SCORE_UPLOAD_URL = f"{MUSESCORECOM_API_ROOT_URL}/score/upload"
MUSESCORECOM_SCORES_URL = f"{MUSESCORECOM_API_ROOT_URL}/collection/scores"


class MuseScoreComApiClient:
    """MuseScore.com API client."""

    token: str
    _access_token_key = "access_token"
    _headers = {
        "Accept": "application/json",
        "X-MS-CLIENT-ID": "11111111-1111-1111-1111-111111111111",
        "User-Agent": "MS_EDITOR/4.5.0. (winnt 10.0.19045 windows 10 x86_64)",
    }

    _user_id: str | None = None

    def __init__(self):
        """Constructor."""

        home = Path.home()
        self.access_file_path = (
            home / r"AppData\Local\MuseScore\MuseScore4\musescorecom_cred.dat"
        )
        assert self.access_file_path.exists()

        # Load access token (handled by MuseScore desktop)
        with open(self.access_file_path, "r") as file:
            access_data = json.load(file)
        self.token = access_data[self._access_token_key]

    def get_user_info(self):
        """Download user info."""

        params = {self._access_token_key: self.token}
        resp = requests.get(
            MUSESCORECOM_USER_INFO_URL, params=params, headers=self._headers
        )
        if resp.status_code != 200:
            print(f"Failed with status code {resp.status_code}")
            return

        resp_val: dict = json.loads(resp.text)
        self._user_id = resp_val["id"]
        user_name = resp_val["name"]
        print(f"Loaded user info of '{user_name}' (id='{self._user_id}')")
        return resp_val

    def get_score_info(self, score_id: str):
        """Load score info of a specific score."""

        get_score_params = {self._access_token_key: self.token, "score_id": score_id}
        resp = requests.get(
            MUSESCORECOM_SCORE_INFO_URL, params=get_score_params, headers=self._headers
        )
        if resp.status_code != 200:
            print(f"Failed with status code {resp.status_code}")
            return None

        resp_val: dict = json.loads(resp.text)
        playback_count = resp_val["playback_count"]
        title = resp_val["metadata"]["title"]
        print(f"Loaded score info, title: '{title}', played: {playback_count} times")
        return resp_val

    def upload_score(
        self,
        score_path: Path,
        title: str,
        score_id: str | None = None,
        public: bool = True,
    ):
        """Upload score."""

        with open(score_path, "rb") as f:
            file_content = f.read()

        file_name = "temp_3242342.mscz"
        files = {
            "score_data": (file_name, file_content, "application/octet-stream"),
        }
        # The 'data' dictionary for non-file fields
        privacy_int = 0 if public else 2
        params = {self._access_token_key: self.token}
        data = {
            "title": title,
            "privacy": str(privacy_int),
            "license": "cc-by-nc",  # Non-commercial
        }
        if score_id is not None:
            data["score_id"] = score_id

            # Make the HTTP request
            response = requests.put(
                MUSESCORECOM_SCORE_UPLOAD_URL,
                params=params,
                files=files,
                data=data,
                headers=self._headers,
            )
        else:
            response = requests.post(
                MUSESCORECOM_SCORE_UPLOAD_URL,
                params=params,
                files=files,
                data=data,
                headers=self._headers,
            )

        if response.status_code != 200:
            print(f"Upload failed with status code {response.status_code}")
            return

        resp_val = json.loads(response.text)
        if score_id is None:
            if self._user_id is None:
                self.get_user_info()

            assert self._user_id is not None

            # Add source ID to file
            score_id = resp_val["id"]
            source_url = f"https://musescore.com/user/{self._user_id}/scores/{score_id}"
            file_manager = MsczFileManager(score_path)
            file_manager.read_mscz()
            file_manager.set_copyright(source=source_url)
            file_manager.write()

        return resp_val

    def upload(self, score_info: dict, public: bool = True):

        mscz_path = Paths.get_mscz_path(score_info)
        if not mscz_path.exists():
            print(f"File {mscz_path} not found!")
            return

        source_id = score_info["source"]
        title = f"{score_info['name']} - {score_info['artist']}"
        source_id = None if source_id == "dummy" else source_id
        self.upload_score(mscz_path, title, source_id, public)


def modify_and_update_online():
    client = MuseScoreComApiClient()

    score_infos = Paths.read_generated_score_info()
    for score_info in tqdm(score_infos, "Re-uploading modified Mscz files"):
        mscz_path = Paths.get_mscz_path(score_info)

        if not mscz_path.exists():
            print(f"File {mscz_path} not found!")
            continue

        file_manager = MsczFileManager(mscz_path)
        file_manager.read_mscz()
        file_manager.set_copyright()
        file_manager.write()

        client.upload(score_info)


def upload_not_yet_uploaded():
    client = MuseScoreComApiClient()
    client.get_user_info()  # To set user ID correctly

    score_infos = Paths.read_generated_score_info()
    for score_info in tqdm(score_infos, "Uploading Mscz files"):
        if score_info["source"] == "dummy":
            client.upload(score_info, True)

            # Export to musicxml
            mscz_path = Paths.get_mscz_path(score_info)
            xml_path = Paths.get_xml_path(score_info)
            export_mscz(mscz_path, xml_path)

            # Reduce XML file
            reduce_file(xml_path)

            print(f"Uploaded {score_info['name']}")
            print("Make sure to close it if open in MuseScore.")
            print("Otherwise, you risk overwriting the source!")


def test():
    alili_score_id = "22385650"
    client = MuseScoreComApiClient()
    client.get_user_info()
    client.get_score_info(alili_score_id)

    test_score_id = "22250446"
    client.upload_score(TEST_SCORE_PATH, "test", test_score_id, public=False)


if __name__ == "__main__":
    # test()
    upload_not_yet_uploaded()
    # check_all_yt_sources()
    # modify_and_update_online()
