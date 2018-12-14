from random import randrange
import datetime 
import copy
import json

with open('random_transactions_five.json') as f:
    data = json.load(f)

result = []
current = []
i = 0

for each in data:
    if i%4 == 3:
        current = []
        for j in range(i - 3, i + 1):
            for trans in data[j]:
                current.append(trans)
        result.append(copy.deepcopy(current))
        current = []
    else:
        for trans in each:
            newTrans = {"from": trans["from"], "to": trans["to"], "time": trans["time"], "amount": trans["amount"], "status": "UNRECORDED", "block": trans["block"]}
            current.append(newTrans)
        result.append(copy.deepcopy(current))
    i += 1

with open('data.json', 'w') as outfile:
    json.dump(result, outfile)
