"""MuseScore.com API client."""

import requests
import json
from pathlib import Path

MUSESCORECOM_API_ROOT_URL = "https://desktop.musescore.com/editor/v1"
MUSESCORECOM_URL = "https://musescore.com"
MUSESCORECOM_USER_INFO_URL = f"{MUSESCORECOM_API_ROOT_URL}/me"
MUSESCORECOM_SCORES_URL = f"{MUSESCORECOM_API_ROOT_URL}/collection/scores"


home = Path.home()
access_file_path = home / r"AppData\Local\MuseScore\MuseScore4\musescorecom_cred.dat"

headers = {
    "Accept": "application/json",
    "X-MS-CLIENT-ID": "11111111-1111-1111-1111-111111111111",
    "User-Agent": "MS_EDITOR/4.5.0. (winnt 10.0.19045 windows 10 x86_64)",
}

access_token_key = "access_token"


def main():
    # Load access token (handled by MuseScore desktop)
    with open(access_file_path, "r") as file:
        access_data = json.load(file)
    token = access_data[access_token_key]
    # print(f"Using token: {token}")

    # Download user info (TODO)
    params = {access_token_key: token}
    resp = requests.get(MUSESCORECOM_USER_INFO_URL, params=params, headers=headers)
    if resp.status_code != 200:
        print(f"Failed with status code {resp.status_code}")
        return

    resp_val = json.loads(resp.text)
    user_id = resp_val["id"]
    user_name = resp_val["name"]
    print(f"Loaded user info of '{user_name}' (id='{user_id}')")


if __name__ == "__main__":
    main()
