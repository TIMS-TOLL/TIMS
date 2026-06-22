import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authcontext";

function InventoryPage() {
  const { user } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const [editId, setEditId] = useState(null);
  const [searchEquipment, setSearchEquipment] = useState("");

  useEffect(() => {
    loadInventory();
    loadSites();
    loadEquipmentTypes();
  }, []);

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("site_name");

    setSites(data || []);
  }

  async function loadEquipmentTypes() {
    const { data } = await supabase
      .from("equipment_types")
      .select("*")
      .order("equipment_name");

    setEquipmentTypes(data || []);
  }

  async function loadInventory() {
    let query = supabase
      .from("inventory")
      .select(`
  *,
  sites(site_name),
  equipment_types(
    equipment_name,
    unit_type
  )
`)
      .order("id", { ascending: false });

    if (user?.role === "Engineer") {
      query = query.eq("site_id", user.site_id);
    }

    const { data, error } = await query;

    if (error) {
      console.log(error);
      return;
    }

    setInventory(data || []);
  }

  async function saveInventory() {
    if (
  !(user?.role === "Engineer"
    ? user.site_id
    : siteId) ||
  !equipmentTypeId ||
  !makeModel ||
  !serialNumber ||
  !quantityReceived ||
  !receivedDate
) {
      alert("Please fill all required fields");
      return;
    }

    let error;

    if (editId) {
      const result = await supabase
        .from("inventory")
        .update({
         site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
          equipment_type_id: equipmentTypeId,
          make_model: makeModel,
          serial_number: serialNumber,
          quantity_received: quantityReceived,
          quantity_available: quantityReceived,
          received_date: receivedDate,
          remarks: remarks,
        })
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("inventory")
        .insert([
          {
            site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
            equipment_type_id: equipmentTypeId,
            make_model: makeModel,
            serial_number: serialNumber,
            quantity_received: quantityReceived,
            quantity_issued: 0,
            quantity_available: quantityReceived,
            received_date: receivedDate,
            received_by: user?.id,
            remarks: remarks,
          },
        ]);

      error = result.error;
    }

    if (error) {
      console.log(error);
      alert("Save Failed");
      return;
    }

    setEditId(null);

    setSiteId("");
    setEquipmentTypeId("");
    setMakeModel("");
    setSerialNumber("");
    setQuantityReceived("");
    setReceivedDate("");
    setRemarks("");

    loadInventory();

    alert("Inventory Saved Successfully");
  }

  function editInventory(item) {
    setEditId(item.id);

    setSiteId(item.site_id);
    setEquipmentTypeId(item.equipment_type_id);
    setMakeModel(item.make_model);
    setSerialNumber(item.serial_number);
    setQuantityReceived(item.quantity_received);
    setReceivedDate(item.received_date);
    setRemarks(item.remarks || "");
  }

  async function deleteInventory(id) {
    const confirmDelete = window.confirm(
      "Delete this Inventory?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("inventory")
      .delete()
      .eq("id", id);

    loadInventory();
  }

  return (
    <div>
      <h1>Inventory Management</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>
          {editId
            ? "Edit Inventory"
            : "Add Inventory"}
        </h3>

        <br />

        <select
  value={
    user?.role === "Engineer"
      ? user.site_id
      : siteId
  }
  onChange={(e) =>
    setSiteId(e.target.value)
  }
  disabled={
    user?.role === "Engineer"
  }
>
          <option value="">
            Select Site
          </option>

          {sites.map((site) => (
            <option
              key={site.id}
              value={site.id}
            >
              {site.site_name}
            </option>
          ))}
        </select>

        <br /><br />

        <select
          value={equipmentTypeId}
          onChange={(e) => {
  setEquipmentTypeId(
    e.target.value
  );

  const selectedEquipment =
    equipmentTypes.find(
      (x) =>
        x.id ===
        Number(e.target.value)
    );

  setSelectedUnit(
    selectedEquipment?.unit_type || ""
  );
}}
        >
          <option value="">
            Select Equipment
          </option>

          {equipmentTypes.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.equipment_name}
            </option>
          ))}
        </select>
<br />

<p>
  <strong>Unit:</strong>{" "}
  {selectedUnit || "-"}
</p>

<br />
        <br /><br />

        <input
          type="text"
          placeholder="Make Model"
          value={makeModel}
          onChange={(e) =>
            setMakeModel(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) =>
            setSerialNumber(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Quantity Received"
          value={quantityReceived}
          onChange={(e) =>
            setQuantityReceived(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={receivedDate}
          onChange={(e) =>
            setReceivedDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <textarea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
        />

        <br /><br />

        <button onClick={saveInventory}>
          {editId
            ? "Update Inventory"
            : "Save Inventory"}
        </button>
      </div>
<input
  type="text"
  placeholder="Search Equipment"
  value={searchEquipment}
  onChange={(e) =>
    setSearchEquipment(e.target.value)
  }
  style={{
    marginBottom: "15px",
    padding: "8px",
    width: "300px",
  }}
/>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          background: "#fff",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Site</th>
            <th>Equipment</th>
            <th>Make Model</th>
            <th>Serial Number</th>
            <th>Received</th>
            <th>Issued</th>
            <th>Unit</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {inventory .filter((item) =>
            item.equipment_types?.equipment_name
      ?.toLowerCase()
      .includes(
        searchEquipment.toLowerCase()
      )
  )
  .map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sites?.site_name}</td>
              <td>
                {item.equipment_types
                  ?.equipment_name}
              </td>
              <td>{item.make_model}</td>
              <td>{item.serial_number}</td>
              <td>{item.quantity_received}</td>
              <td>{item.quantity_issued}</td>
              <td>{item.equipment_types?.unit_type}</td>
              <td>{item.quantity_available}</td>

              <td>
                <button
                  onClick={() =>
                    editInventory(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteInventory(item.id)
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

export default InventoryPage;