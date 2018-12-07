function shuffleArray(array) {
  let newArrr = JSON.parse(JSON.stringify(array));
  for (let i = newArrr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = newArrr[i];
      newArrr[i] = newArrr[j];
      newArrr[j] = temp;
  }
  return newArrr;
}

export {shuffleArray};