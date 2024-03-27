export function sanitizeText(text) {
	return text.replace(/[&<>"'\/`~!@#$%^&*()_+=\[\]{};:\\|,.<>?]/g, function (character) {
	  // Object mapping special characters to their HTML entities
	  const entities = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#47;',
		'`': '&#96;',
		'~': '&#126;',
		'!': '&#33;',
		'@': '&#64;',
		'#': '&#35;',
		'$': '&#36;',
		'%': '&#37;',
		'^': '&#94;',
		'*': '&#42;',
		'(': '&#40;',
		')': '&#41;',
		'_': '&#95;',
		'+': '&#43;',
		'=': '&#61;',
		'[': '&#91;',
		']': '&#93;',
		'{': '&#123;',
		'}': '&#125;',
		';': '&#59;',
		':': '&#58;',
		'\\': '&#92;',
		'|': '&#124;',
		',': '&#44;',
		'.': '&#46;',
		'?': '&#63;'
		// Add more mappings here as needed
	  };
	  return entities[character] || character; // Use the entity if available, else keep the character
	});
}