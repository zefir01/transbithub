#!/usr/bin/python3
import base64
import os
import sys

import yaml
import hashlib
import copy
import argparse
import tempfile


# cython3 --embed -3 main.py


class Config:
    file = ""
    name = ""
    data = ""
    hash = ""
    full_name = ""

    def __init__(self, file_name, name, folder: str):
        self.name = name
        self.file = file_name
        try:
            with open(folder + "/" + file_name) as f:
                self.data = f.read()
        except UnicodeDecodeError:
            try:
                with open(folder + "/" + file_name, "rb") as f:
                    self.data = f.read()
                    self.data = str(self.data)
            except:
                print("Read file error: " + folder + "/" + file_name)
                sys.exit(1)
        hash_object = hashlib.sha1(self.data.encode())
        self.hash = str(base64.urlsafe_b64encode(hash_object.digest()).decode('ascii')).replace('_', '')[:5]
        self.full_name = self.name + "-" + self.hash


def run(file: str, context: str, stack: str, output: str):
    folder = os.path.dirname(os.path.abspath(file))
    with open(file) as f:
        compose = yaml.load(f, Loader=yaml.FullLoader)
        configs = list()

    if "configs" in compose:
        for item, doc in compose["configs"].items():
            if "file" not in doc:
                print(f"Unsupported config: {item}. Exiting")
                sys.exit(1)
            if "external" in doc:
                print(f"Warning: external config: {item}")
                continue
            if "name" in doc:
                c = Config(doc["file"], doc["name"], folder)
                configs.append(c)
            else:
                c = Config(doc["file"], item, folder)
                configs.append(c)
    else:
        print("No configs found. Exiting.")
        sys.exit(1)

    new = copy.deepcopy(compose)

    for item, doc in compose["configs"].items():
        if "external" in doc:
            continue
        config = next((x for x in configs if x.name == item), None)
        new["configs"].pop(item)
        new["configs"][config.full_name] = {"file": config.file}

    for svc in compose["services"].items():
        if "configs" not in svc[1]:
            continue
        new_svc = list(copy.deepcopy(svc))
        new_svc[1]["configs"] = []
        for s in svc[1]["configs"]:
            if "source" not in s:
                print(f"Unsupported config using: {s}. Exiting")
                sys.exit(1)
            c = next((x for x in configs if x.name == s["source"]), None)
            new_svc[1]["configs"].append({"source": c.full_name, "target": s["target"]})
        new["services"][new_svc[0]] = new_svc[1]

    print(yaml.dump(new))

    if output!="":
        with open(output, 'w') as out_file:
            out_file.write(yaml.dump(new))
            out_file.close()
            sys.exit(0)


    with tempfile.NamedTemporaryFile(mode='w', delete=False) as tmp:
        print("Temp file: " + tmp.name)
        tmp.write(yaml.dump(new))
        tmp.close()
        if context != "":
            os.system(f"docker --context {context} stack deploy --prune -c {tmp.name} {stack}")
        else:
            os.system(f"docker stack deploy --prune -c {tmp.name} {stack}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", type=str, help="composer/stack file for deploy", required=True)
    parser.add_argument("-c", "--context", type=str, help="docker context for deploy", default="")
    parser.add_argument("-s", "--stack", type=str, help="docker stack name", required=True)
    parser.add_argument("-o", "--output", type=str, help="output file", default="")
    args = parser.parse_args()
    run(args.file, args.context, args.stack, args.output)
