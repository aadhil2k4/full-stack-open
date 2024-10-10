import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateBlog } from '../reducers/blogReducer';
import { createNotification } from '../reducers/notificationReducer';
import BlogComments from '../components/BlogComments';

const BlogsDetailsPage = () => {
  const dispatch = useDispatch();

  const id = useParams().id;

  const blogs = useSelector((state) => state.blogs.data);
  const blog = blogs.find((n) => n.id === String(id));

  if (!blog) {
    return null;
  }

  const handleLike = () => {
    const newwBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      dispatch(updateBlog(newwBlog));
      dispatch(
        createNotification(`You added one like for "${newwBlog.title}"`)
      );
    } catch (err) {
      console.log(err);
      dispatch(createNotification(`Error: ${err.response.data.error}`));
    }
  };

  return (
    <div>
      <h2>{blog.title}</h2>

      <p>author: {blog.author}</p>

      <p>
        url:
        <a href={blog.url}> {blog.url}</a>
      </p>

      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>

      <p>Added by {blog.user !== null && blog.user.name}</p>

      <BlogComments id={blog.id} />
    </div>
  );
};

export default BlogsDetailsPage;