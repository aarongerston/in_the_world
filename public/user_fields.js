

	// // SCOPE DROPDOWN
	// const scopeSelect = document.getElementById('scopeSelect');
	// scopeSelect.addEventListener('change', (event) => {
	// 	console.log('new scope: ' + event.target.value);
	// 	scope = event.target.value;
	// 	info.update({})
	// });

	// QUESTION TEXT
	const questionText = document.getElementById('questionText');
	questionText.addEventListener('keyup', updateValue);
	function updateValue(event) {
		console.log('new question: ' + event.target.value);
		question = event.target.value;
		info.update({})
	}