import os

signatures = {
    b"%PDF": "PDF",
    b"\xFF\xD8\xFF": "JPEG",
    b"\x89PNG": "PNG",
    b"GIF8": "GIF",
    b"PK\x03\x04": "ZIP",
    b"ID3": "MP3",          # Most common
    b"\xFF\xFB": "MP3",     # MPEG-1 Layer III
    b"\xFF\xF3": "MP3",     # MPEG-2 Layer III
    b"\xFF\xF2": "MP3",
}

folder_name = "./lab1/test"

for file_name in os.listdir(folder_name):

    file_path = os.path.join(folder_name, file_name)

    if not os.path.isfile(file_path):
        continue

    compare_name = file_name.split(".")[-1].upper()

    with open(file_path, "rb") as f:
        header = f.read(8)

    found = False

    for sig, actual_type in signatures.items():
        if header.startswith(sig):
            found = True

            if compare_name == actual_type:
                print(f"{file_name} -> Valid ({actual_type})")
            else:
                print(f"{file_name} -> Extension: {compare_name}, Actual: {actual_type}")

            break

    if not found:
        print(f"{file_name} -> Unknown file type")