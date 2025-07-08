import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/api/forms/admin/all").then(setForms);
  }, []);

  return (
    <div>
      <h2>Forms</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>User Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td>{form.title}</td>
              <td>
                {form.owner?.avatar && (
                  <img src={form.owner.avatar} alt="avatar" width={24} height={24} style={{ borderRadius: "50%" }} />
                )}
                {form.owner?.name} ({form.owner?.email})
              </td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
                <button>See Answers</button>
                <button>Answer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}