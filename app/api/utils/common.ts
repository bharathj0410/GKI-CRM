export function incrementBillNumber(billNo: string) {
  const match = billNo.match(/^(.*-)([A-Z]{2})(\d{6})$/);

  if (!match) {
    throw new Error("Invalid bill number format");
  }

  const prefix = match[1];
  let alpha = match[2];
  let number = match[3];

  let num = parseInt(number, 10) + 1;

  if (num > 999999) {
    num = 1;
    alpha = incrementAlpha(alpha);
  }

  const incrementedNumber = num.toString().padStart(6, "0");

  return prefix + alpha + incrementedNumber;
}

function incrementAlpha(alpha: string) {
  let chars = alpha.split("").reverse();
  let carry = 1;

  for (let i = 0; i < chars.length; i++) {
    if (carry === 0) break;

    let code = chars[i].charCodeAt(0) + carry;

    if (code > "Z".charCodeAt(0)) {
      chars[i] = "A";
      carry = 1;
    } else {
      chars[i] = String.fromCharCode(code);
      carry = 0;
    }
  }

  if (carry === 1) {
    throw new Error("Alpha prefix limit exceeded");
  }

  return chars.reverse().join("");
}
