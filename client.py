"""MuseScore.com API client."""

import requests
import json
from pathlib import Path

from msczpy import TEST_SCORE_PATH

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
        user_id = resp_val["id"]
        user_name = resp_val["name"]
        print(f"Loaded user info of '{user_name}' (id='{user_id}')")
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

    def upload_score(self, score_path: Path, score_id: str, title: str):
        """Upload score."""

        with open(score_path, "rb") as f:
            file_content = f.read()

        file_name = "temp_3242342.mscz"
        files = {
            "score_data": (file_name, file_content, "application/octet-stream"),
        }
        # The 'data' dictionary for non-file fields
        data = {
            "score_id": score_id,
            "title": title,
            "privacy": str(0),  # Public
            "license": "cc-by-nc",  # Non-commercial
        }

        # Make the HTTP request
        params = {self._access_token_key: self.token}
        response = requests.put(
            MUSESCORECOM_SCORE_UPLOAD_URL,
            params=params,
            files=files,
            data=data,
            headers=self._headers,
        )
        if response.status_code != 200:
            print(f"Upload failed with status code {response.status_code}")
            return

        print("Successfully uploaded score!")
        resp_val = json.loads(response.text)
        return resp_val


def main():
    test_score_id = "22250446"
    # alili_score_id = "22385650"
    used_score_id = test_score_id

    client = MuseScoreComApiClient()
    client.get_user_info()
    score_info = client.get_score_info(used_score_id)
    title = score_info["metadata"]["title"]
    resp_val = client.upload_score(TEST_SCORE_PATH, used_score_id, title)
    print(resp_val)


if __name__ == "__main__":
    main()
