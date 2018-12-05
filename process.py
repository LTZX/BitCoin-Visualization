import json, random
from collections import defaultdict
nodes_info = json.loads(open("node_file.json").read())
nodes = list(nodes_info.keys())
valid_dic = defaultdict(list)

def get_status():
	rand = random.randrange(1, 21)
	if 1 <= rand <= 14:
		return "VALID"
	elif 15 <= rand <= 16:
		return "UNRECORDED"
	return "INVALID"
		
def get_random( used):
	ind1, ind2 = random.randrange(0, len(nodes)), random.randrange(0, len(nodes))
	while ind1 in used:
		ind1 = random.randrange(0, len(nodes))
	used.add(ind1)
	while ind2 == ind1:
		ind2 = random.randrange(0, len(nodes))
	return nodes[ind1], nodes[ind2]
	
			
def generate_random_transaction(i, j,unrecorded,used):
	FROM, TO = get_random(used)
	amount = random.randrange(0, nodes_info[FROM]["Balance"])
	status = get_status()
	
	if status == "VALID":
		nodes_info[FROM]["Balance"] -= amount
		nodes_info[TO]["Balance"] += amount
		tmp = {"status":"VALID", "from":FROM, "to":TO, "amount": amount, "time":j, "block":i}
		valid_dic[i].append(tmp)
	elif status == "UNRECORDED":
		tmp = {"status":"UNRECORDED", "from":FROM, "to":TO, "amount": amount, "time":j, "block":i}
		unrecorded.append(tmp)	
	
def main():
	unrecorded = []
	for i in range(0, 300, 20):
		if not unrecorded:
			unrecorded = transform_unrecorded(i,unrecorded)
		used = set()
		for j in range(i, i+20):	
			generate_random_transaction(i, j,unrecorded, used)
			
def transform_unrecorded(block_ind, unrecorded):
	tmp = []
	for i, dic in unrecorded:
		if get_status() == "VALID":
			dic["block"] = block_ind
			valid_dic[block_ind].append(dic)
			nodes_info[FROM]["Balance"] -= dic["amount"]
			nodes_info[TO]["Balance"] += dic["amount"]
			delete.append(i)	
		else:
			tmp.append(dic)
	return tmp
	

	
if __name__ == '__main__':
	main()
	with open("random_transactions.json", "wb") as f:
		f.write(json.dumps(valid_dic).encode("utf-8"))	
		
			