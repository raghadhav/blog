const dummy = (blogs) => {
  return 1;
}
const totalLikes = (blogs) => {
  var totalLikesSum = 0;
  for (i = 0; i < blogs.length; i++) {
    totalLikesSum = totalLikesSum + blogs[i].likes;
  }
  return totalLikesSum;
}
// function onlyUnique(value, index, self) {
//   return self.indexOf(value) === index;
// }

const uniq_firstnames = (blogs) => {
  // N = length of blogs
  // M = length of unique first nmes array
  // O(N^2) -> O(NM), M <= N
  return blogs.map((blog) => { // O(N)
    return blog.author.split(" ")[0]; // O(M)
  }).filter((value, index, array) => { // O(N)
    return array.indexOf(value) === index; //O(N) -> O(N^2)
  });
} // [ 'Robert', 'Robert']
const favoriteBlog = ((blogs) => {
  var mostLikesBlogs = blogs[0];
  for (i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLikesBlogs.likes)
      mostLikesBlogs = blogs[i];
  }
  const ResultBlog = {
    title: mostLikesBlogs.title,
    author: mostLikesBlogs.author,
    likes: mostLikesBlogs.likes
  }
  return (ResultBlog);
})

const mostBlogs = (blogs) => {
  mostB = 0;
  mostAuthor = blogs[0].author;
  sumAuthor = 0;
  for (var i = 1; i < blogs.length; i++) {
    for (var j = 0; j < blogs.length; j++) {
      if (blogs[i].author === blogs[j].author && j !== i)
        sumAuthor += 1;
    }
    if (sumAuthor > mostB) {
      mostB = sumAuthor;
      mostAuthor = blogs[i].author;
      sumAuthor = 0;
    }
  }
  return (mostAuthor)
}

module.exports = {
  dummy,
  totalLikes,
  uniq_firstnames,
  favoriteBlog,
  mostBlogs
}