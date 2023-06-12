class TreeNode {
	constructor(contents, parent) {
		this.contents = contents;
		this.children = [];
		this.parent = parent;
		this.traversed = false;
	}

	add(node) {
		this.children.push(node);
		node.parent = this;
	}
}