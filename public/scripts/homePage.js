async function fetchPosts() {
  try {
    const response = await fetch(`localhost:3000/bbb/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data fetched from /api/public/data.json:", data);
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

function displayPosts(data) {
  if (!data || !data.posts) {
    console.error("No posts or 'posts' key not found in data");
    return;
  }

  const postsContainer = document.getElementById("posts");
  data.posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    postElement.innerHTML = `
      <img src="${post.imageUrl}" alt="${post.title}"> 
      <h2>${post.title}</h2>
      <p>${post.description}</p>
      <a href="${post.url}" target="_blank">Read More</a>
    `;
    postsContainer.appendChild(postElement);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchPosts();
  displayPosts(data);
});
