class TreeNode {
	constructor(contents, parent) {
		this.contents = contents;
		this.children = [];
		this.parent = parent;
	}

	add(node) {
		this.children.push(node);
		node.parent = this;
	}
}