var TreeNodeIdentifierNumber = 0;

class TreeNode {
	constructor(contents, parent) {
		this.contents = contents;
		this.idd = TreeNodeIdentifierNumber;
		TreeNodeIdentifierNumber++;
		this.children = [];
		this.parent = parent;
	}

	add(node) {
		this.children.push(node);
		node.parent = this;
	}
}