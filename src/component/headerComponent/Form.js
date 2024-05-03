import { useEffect, useState, useCallback } from "react";
import { db } from "./service";
import "./Form.css";
function FormAdmin() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState(0);
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = useCallback(() => {
        db.book.toArray().then(items => {
            setBooks(items);
            setFeedback("");
        });
    }, []);

    const clearForm = useCallback(() => {
        setTitle("");
        setAuthor("");
        setYear(0);
    }, []);

    const save = useCallback(() => {
        if (!title) {
            setFeedback("Error: Title is required to save a book.");
            return;
        }

        const book = { title, author, year };
        db.book.put(book).then(() => {
            fetchBooks();
            clearForm();
            setFeedback("Book saved successfully!");
        });
    }, [title, author, year, clearForm, fetchBooks]);

    const deleteBook = useCallback((title) => {
        db.book.delete(title).then(() => {
            fetchBooks();
            setFeedback("Book deleted successfully.");
        });
    }, [fetchBooks]);

    const editBook = useCallback((book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setYear(book.year);
    }, []);

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(search.toLowerCase())
    );
        <h2>List of books</h2>
    return (
        <>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Author:</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
                <label>Year:</label>
                <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10) || '')} />
            </div>
            <button onClick={save}>Save</button>
            <button onClick={clearForm}>Clear</button>

            <input
                type="text"
                placeholder="Search by Author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {feedback && <p>{feedback}</p>}

            <table style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book) => (
                        <tr key={book.title}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.year}</td>
                            <td>
                                <button onClick={() => editBook(book)}>Edit</button>
                                <button onClick={() => deleteBook(book.title)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default FormAdmin;
