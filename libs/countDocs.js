async function countDocs(model) {
  const count = await model.countDocuments();
  return count;
}

module.exports = countDocs;
