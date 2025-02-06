const TRANSFORM = {TRANSLATE: 0, SCALE: 1, REFLECT: 2, ROTATE: 3, SHEAR: 4, CUSTOM: 5};

const TRANSFORM_DESC = {[TRANSFORM.TRANSLATE]: "Translate", [TRANSFORM.SCALE]: "Scale", [TRANSFORM.REFLECT]: "Reflect", [TRANSFORM.ROTATE]: "Rotate", [TRANSFORM.SHEAR]: "Shear", [TRANSFORM.CUSTOM]: "Custom"};

const REFLECTION = {NONE: 0, X_AXIS: 1, Y_AXIS: 2, X_AND_Y_AXES: 3, POSITIVE_DIAGONAL: 4, NEGATIVE_DIAGONAL: 5};

const REFLECTION_DESC = {[REFLECTION.NONE]: "None", [REFLECTION.X_AXIS]: "X-Axis", [REFLECTION.Y_AXIS]: "Y-Axis", [REFLECTION.X_AND_Y_AXES]: "X and Y Axes", [REFLECTION.POSITIVE_DIAGONAL]: "Positive Diagonal", [REFLECTION.NEGATIVE_DIAGONAL]: "Negative Diagonal"};

class Transform {
	/** The type of the transformation. @type {number} */
	type = TRANSFORM.TRANSLATE;
	/** The data of the transformation. @type {number[] | Matrix} */
	data = [0, 0];

	/**
	 * Returns a new transformation with the given type and data.
	 * @param {number} type - The type of the transformation.
	 * @param {number[]} data - The data of the transformation. Defaults to `Transform.getDefaultData(type)`.
	 */
	constructor(type, data = Transform.getDefaultData(type)) {
		this.type = type;
		this.data = data;
	};

	/**
	 * Returns the default data for the given transformation type.
	 * @param {number} type - The transformation type.
	 */
	static getDefaultData(type) {
		if (type === TRANSFORM.TRANSLATE || type === TRANSFORM.SHEAR) return [0, 0];
		if (type === TRANSFORM.SCALE) return [1, 1];
		if (type === TRANSFORM.REFLECT) return [REFLECTION.NONE];
		if (type === TRANSFORM.ROTATE) return [0];
		if (type === TRANSFORM.CUSTOM) return Matrix.identity(2);
		return [];
	};

	/**
	 * Returns a new matrix that is the result of applying the given transformations to the given matrix.
	 * @param {Matrix} matrix - The matrix to transform.
	 * @param {Transform[]} transforms - The transformations to apply.
	 */
	static transformMatrix(matrix, transforms) {
		for (const transform of transforms) {
			console.log(transform.getMatrix());
			if (transform.type === TRANSFORM.TRANSLATE) matrix = transform.getMatrix().add(matrix);
			else matrix = transform.getMatrix().multiply(matrix);
		};
		return matrix;
	};

	/**
	 * Returns the default data for the transformation's type.
	 */
	getDefaultData() {
		return Transform.getDefaultData(this.type);
	};

	/**
	 * Returns the transformation matrix that represents the current transformation.
	 */
	getMatrix() {
		if (this.type === TRANSFORM.TRANSLATE) return Matrix.fromArray([[this.data[0]], [this.data[1]]], true);
		if (this.type === TRANSFORM.SCALE) return Matrix.fromArray([[this.data[0], 0], [0, this.data[1]]]);
		if (this.type === TRANSFORM.REFLECT) {
			if (this.data[0] === REFLECTION.NONE) return Matrix.fromArray([[1, 0], [0, 1]]);
			if (this.data[0] === REFLECTION.X_AXIS) return Matrix.fromArray([[1, 0], [0, -1]]);
			if (this.data[0] === REFLECTION.Y_AXIS) return Matrix.fromArray([[-1, 0], [0, 1]]);
			if (this.data[0] === REFLECTION.X_AND_Y_AXES) return Matrix.fromArray([[-1, 0], [0, -1]]);
			if (this.data[0] === REFLECTION.POSITIVE_DIAGONAL) return Matrix.fromArray([[0, 1], [1, 0]]);
			if (this.data[0] === REFLECTION.NEGATIVE_DIAGONAL) return Matrix.fromArray([[0, -1], [-1, 0]]);
		};
		if (this.type === TRANSFORM.ROTATE) {
			const angle = this.data[0] * Math.PI / 180;
			return Matrix.fromArray([[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]]);
		};
		if (this.type === TRANSFORM.SHEAR) return Matrix.fromArray([[1, this.data[0]], [this.data[1], 1]]);
		if (this.type === TRANSFORM.CUSTOM) return this.data;
		return Matrix.identity(2);
	};

	/**
	 * Returns a string representation of the transformation.
	 */
	toString() {
		if (this.type === TRANSFORM.REFLECT) TRANSFORM_DESC[this.type] + ": " + REFLECTION_DESC[this.data[0]];
		if (this.type === TRANSFORM.CUSTOM) return TRANSFORM_DESC[this.type] + ": " + this.data.toString();
		if (this.data.length === 1) return TRANSFORM_DESC[this.type] + ": " + this.data[0];
		return TRANSFORM_DESC[this.type] + ": (" + this.data.join(", ") + ")";
	};

	/**
	 * Returns an HTML representation of the transformation.
	 */
	toHTML() {
		if (this.type === TRANSFORM.CUSTOM) return "<div class='transform'>" + TRANSFORM_DESC[this.type] + ": " + this.data.toHTML() + "</div>";
		return "<div class='transform'>" + this.toString() + "</div>";
	};

	/**
	 * Returns an editable HTML representation of the transformation.
	 * @param {string} name - The name of the transformation.
	 * @param {function} typeFunction - The function to call when the transformation type is edited.
	 * @param {function} updateFunction - The function to call when the transformation type or data is edited.
	 */
	toEditableHTML(name, typeFunction, updateFunction) {
		let html = "<div class='transform'>";
		html += "<div><select id='" + name + "-type' onchange='" + name + " = new Transform(+this.value); " + typeFunction.name + "(); " + updateFunction.name + "()'>";
		for (const type in TRANSFORM_DESC) {
			if (TRANSFORM_DESC.hasOwnProperty(type)) {
				html += "<option value='" + type + "'" + (+type === this.type ? " selected" : "") + ">" + TRANSFORM_DESC[type] + "</option>";
			};
		};
		html += "</select>:</div>";
		if (this.type === TRANSFORM.REFLECT) {
			html += "<select id='" + name + "-0' onchange='" + name + ".data[0] = +this.value; " + updateFunction.name + "()'>";
			for (const reflection in REFLECTION_DESC) {
				if (REFLECTION_DESC.hasOwnProperty(reflection)) {
					html += "<option value='" + reflection + "'" + (+reflection === this.data[0] ? " selected" : "") + ">" + REFLECTION_DESC[reflection] + "</option>";
				};
			};
			html += "</select>";
		} else if (this.type === TRANSFORM.CUSTOM) {
			html += this.data.toEditableHTML(name + ".data", updateFunction);
		} else if (this.data.length === 1) {
			html += "<input type='number' id='" + name + "-0' value='" + this.data[0] + "' oninput='" + name + ".data[0] = +this.value; " + updateFunction.name + "()'>";
		} else {
			html += "<div>(";
			for (let index = 0; index < this.data.length; index++) {
				if (index > 0) html += ",</div><div>";
				html += "<input type='number' id='" + name + "-" + index + "' value='" + this.data[index] + "' oninput='" + name + ".data[" + index + "] = +this.value; " + updateFunction.name + "()'>";
			};
			html += ")</div>";
		};
		return html + "</div>";
	};
};
