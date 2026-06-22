import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);

  const [equipmentName, setEquipmentName] =
    useState("");

  const [unitType, setUnitType] =
    useState("Nos");

  const [editId, setEditId] =
    useState(null);

  const [searchEquipment, setSearchEquipment] =
    useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    const { data, error } = await supabase
      .from("equipment_types")
      .select("*")
      .order("id");

    if (error) {
      console.log(error);
      return;
    }

    setEquipment(data || []);
  }

  async function saveEquipment() {
    if (!equipmentName) {
      alert("Please Enter Equipment Name");
      return;
    }

    let error;

    if (editId) {
      const result = await supabase
        .from("equipment_types")
        .update({
          equipment_name: equipmentName,
          unit_type: unitType,
        })
        .eq("id", editId);

      error = result.error;

    } else {
      const result = await supabase
        .from("equipment_types")
        .insert([
          {
            equipment_name: equipmentName,
            unit_type: unitType,
          },
        ]);

      error = result.error;
    }

    if (error) {
      console.log(error);
      alert("Save Failed");
      return;
    }

    setEquipmentName("");
    setUnitType("Nos");
    setEditId(null);

    loadEquipment();

    alert("Saved Successfully");
  }

  function editEquipment(item) {
    setEditId(item.id);

    setEquipmentName(
      item.equipment_name
    );

    setUnitType(
      item.unit_type || "Nos"
    );
  }

  async function deleteEquipment(id) {
    const confirmDelete =
      window.confirm(
        "Delete this Equipment?"
      );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("equipment_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    loadEquipment();

    alert("Deleted Successfully");
  }

  return (
    <div>
      <h1>Equipment Types</h1>

      <div className="form-card">

        <h3>
          {editId
            ? "Edit Equipment"
            : "Add Equipment"}
        </h3>

        <br />

        <input
          type="text"
          placeholder="Equipment Name"
          value={equipmentName}
          onChange={(e) =>
            setEquipmentName(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <select
          value={unitType}
          onChange={(e) =>
            setUnitType(
              e.target.value
            )
          }
        >
          <option value="Nos">
            Nos
          </option>

          <option value="Meter">
            Meter
          </option>

          <option value="Roll">
            Roll
          </option>

          <option value="Box">
            Box
          </option>

          <option value="Set">
            Set
          </option>
        </select>

        <br />
        <br />

        <button
          onClick={saveEquipment}
        >
          {editId
            ? "Update Equipment"
            : "Save Equipment"}
        </button>

      </div>

      <br />

      <input
        className="search-box"
        type="text"
        placeholder="Search Equipment"
        value={searchEquipment}
        onChange={(e) =>
          setSearchEquipment(
            e.target.value
          )
        }
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: "20px",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Equipment Name</th>
            <th>Unit Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {equipment
            .filter((item) =>
              item.equipment_name
                ?.toLowerCase()
                .includes(
                  searchEquipment.toLowerCase()
                )
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  {item.equipment_name}
                </td>

                <td>
                  {item.unit_type}
                </td>

                <td>
                  <button
                    onClick={() =>
                      editEquipment(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteEquipment(
                        item.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default EquipmentPage;