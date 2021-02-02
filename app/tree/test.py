data = {
    "node_set": [
        {
            "id": 1,
            "parent": None,
            "desc": "Your sticker limit is now 4.",
            "node_set": [],
        },
        {
            "id": 3,
            "parent": None,
            "desc": "You have two sets of headphones now. Both outspeak the mind of who YOU are looking at.",
            "node_set": [
                {
                    "id": 4,
                    "parent": 3,
                    "desc": "Something else",
                    "node_set": [],
                },
                {
                    "id": 5,
                    "parent": 3,
                    "desc": "A bit more",
                    "node_set": [],
                },
            ],
        },
    ],
}

d = {
    "node_set": [
        {
            "name": "A",
            "node_set": [
                {
                    "name": "B",
                    "node_set": [
                        {"name": "D", "node_set": []},
                        {"name": "E", "node_set": []},
                    ],
                },
                {
                    "name": "C",
                    "node_set": [
                        {"name": "F", "node_set": []},
                        {"name": "G", "node_set": []},
                    ],
                },
            ],
        }
    ]
}

complex = {
    "node_set": [
        {
            "desc": "A",
            "node_set": [
                {
                    "desc": "B",
                    "node_set": [
                        {"desc": "C", "node_set": []},
                        {"desc": "D", "node_set": []},
                    ],
                },
                {
                    "desc": "E",
                    "node_set": [
                        {"desc": "F", "node_set": [{"desc": "G", "node_set": []}]}
                    ],
                },
                {
                    "desc": "H",
                    "node_set": [
                        {"desc": "I", "node_set": []},
                        {"desc": "J", "node_set": []},
                        {
                            "desc": "K",
                            "node_set": [
                                {"desc": "L", "node_set": []},
                                {"desc": "M", "node_set": []},
                            ],
                        },
                    ],
                },
            ],
        }
    ]
}


def recursive(root):
    if root != None:
        print(root["name"], end=" ")
        for node in root["node_set"]:
            recursive(node)


root = d["node_set"][0]
recursive(root)
print()


def recursive2(root):
    if root != None:
        print(root["desc"], end=" ")
        for node in root["node_set"]:
            recursive2(node)


for node in data["node_set"]:
    recursive2(node)
print()

for node in complex["node_set"]:
    recursive2(node)