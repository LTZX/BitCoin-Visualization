import json, random, operator, datetime
from random import randrange

nodes_info = json.loads(open("node_file.json").read())
nodes = list(nodes_info.keys())
valid_dic = []


def random_date():
    start = datetime.datetime(2018, 10, 24, 10, 00)
    return start + datetime.timedelta(seconds=randrange(60 * 5 * 60))


allTimes = []
for i in range(300):
    allTimes.append(random_date())

allTimes.sort();


def get_status():
    rand = random.randrange(1, 21)
    if 1 <= rand <= 14:
        return "VALID"
    elif 15 <= rand <= 16:
        return "UNRECORDED"
    return "INVALID"


def get_random(used):
    ind1, ind2 = random.randrange(0, len(nodes)), random.randrange(0, len(nodes))
    while ind1 in used:
        ind1 = random.randrange(0, len(nodes))
    used.add(ind1)
    while ind2 == ind1:
        ind2 = random.randrange(0, len(nodes))
    return nodes[ind1], nodes[ind2]


def generate_random_transaction(i, j, unrecorded, used):
    FROM, TO = get_random(used)
    amount = random.randrange(0, nodes_info[FROM]["Balance"])
    status = get_status()

    if status == "VALID":
        nodes_info[FROM]["Balance"] -= amount
        nodes_info[TO]["Balance"] += amount
        tmp = {"status": "VALID", "from": FROM, "to": TO, "amount": amount, "time": allTimes[j].strftime("%d/%m/%y %H:%M:%S"), "block": i}
        valid_dic.append(tmp)
    elif status == "UNRECORDED":
        tmp = {"status": "UNRECORDED", "from": FROM, "to": TO, "amount": amount, "time": allTimes[j].strftime("%d/%m/%y %H:%M:%S"), "block": i}
        valid_dic.append(tmp)
        unrecorded.append(tmp)
    else:
        tmp = {"status": "INVALID", "from": FROM, "to": TO, "amount": amount, "time": allTimes[j].strftime("%d/%m/%y %H:%M:%S"), "block": -1}
        valid_dic.append(tmp)


def main():
    unrecorded = []
    for i in range(0, 300, 20):
        if not unrecorded:
            unrecorded = transform_unrecorded(i, unrecorded)
        used = set()
        for j in range(i, i + 20):
            generate_random_transaction(i, j, unrecorded, used)


def transform_unrecorded(block_ind, unrecorded):
    tmp = []
    for i, dic in unrecorded:
        if get_status() == "VALID":
            dic["block"] = block_ind
            valid_dic.append(dic)
            nodes_info[FROM]["Balance"] -= dic["amount"]
            nodes_info[TO]["Balance"] += dic["amount"]
            delete.append(i)
        else:
            valid_dic.append(dic)
            tmp.append(dic)
    return tmp


if __name__ == '__main__':
    main()
    valid_dic.sort(key=operator.itemgetter("time"))

    result = []
    index = 1
    i = 0
    currentTimeInterval = []
    while index <= 60 and i < len(valid_dic):
        currentBar = (datetime.datetime(2018, 10, 24, 10, 00) + datetime.timedelta(minutes=index * 5)).strftime(
            "%d/%m/%y %H:%M:%S")
        if valid_dic[i]["time"] > currentBar:
            result.append(currentTimeInterval)
            currentTimeInterval = []
            index += 1
            i += 1
        else:
            currentTimeInterval.append(valid_dic[i])
            i += 1

    print("here")
    with open("random_transactions_five.json", "wb") as f:
        f.write(json.dumps(result).encode("utf-8"))

    print("here")
