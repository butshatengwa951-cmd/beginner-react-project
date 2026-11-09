import { useState } from "react";

const emptyForm = { title: "", category: "React", dueDate: "" };

export default function TaskForm({ onCreate, submitting }) {
  const [form, setForm] = useState(emptyForm);

  function handleChange(event) {
    const { name, value } = event.target;

    // Copy the old object; do not mutate a React state object directly.
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();

    if (!title) {
      return;
    }

    const created = await onCreate({
      title,
      category: form.category,
      dueDate: form.dueDate,
    });

    if (created) {
      setForm(emptyForm);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Task name
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Learn React useEffect"
          maxLength={120}
          required
        />
      </label>

      <div className="form-row">
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option>React</option>
            <option>Firebase</option>
            <option>Backend</option>
            <option>Google Sheets</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}
