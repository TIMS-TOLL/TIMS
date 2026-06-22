import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authcontext";

function InstallationsPage() {
  const [installations, setInstallations] = useState([]);

  const { user } = useAuth();

  const [sites, setSites] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [zoneType, setZoneType] = useState("Lane");
  const [location, setLocation] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [installDate, setInstallDate] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [remarks, setRemarks] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchEquipment, setSearchEquipment] = useState("");

  useEffect(() => {
    loadInstallations();
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

  async function loadInstallations() {
  let query = supabase
    .from("equipment_installations")
    .select(`
      *,
      sites(site_name),
      equipment_types(equipment_name)
    `)
    .order("id", { ascending: false });

  if (user?.role === "Engineer") {
    query = query.eq(
      "site_id",
      user.site_id
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.log(error);
    return;
  }

  setInstallations(data || []);
}

  async function saveInstallation() {
  if (
  !(user?.role === "Engineer" ? user.site_id : siteId) ||
  !location ||
  !equipmentTypeId ||
  !installDate
) {
    alert("Please fill all required fields");
    return;
  }
let inventoryData = null;

if (!editId) {

  const result = await supabase
    .from("inventory")
    .select("*")
    .eq(
      "site_id",
      user?.role === "Engineer"
        ? user.site_id
        : siteId
    )
    .eq(
      "equipment_type_id",
      equipmentTypeId
    )
    .single();

  inventoryData = result.data;

  if (!inventoryData) {
    alert(
      "Inventory record not found for selected equipment."
    );
    return;
  }

  if (
    Number(quantity) >
    Number(
      inventoryData.quantity_available
    )
  ) {
    alert(
      `Not enough stock available.\nAvailable Quantity: ${inventoryData.quantity_available}`
    );
    return;
  }
}
  let error;

if (editId) {

  const result = await supabase
    .from("equipment_installations")
    .update({
      site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
      zone_type: zoneType,
      location: location,
      equipment_type_id: equipmentTypeId,
      quantity: quantity,
      install_date: installDate,
      status: status,
      remarks: remarks,
    })
    .eq("id", editId);

  error = result.error;

} else {

  const result = await supabase
    .from("equipment_installations")
    .insert([
      {
        site_id:
        user?.role === "Engineer"
          ? user.site_id
          : siteId,
        zone_type: zoneType,
        location: location,
        equipment_type_id: equipmentTypeId,
        quantity: quantity,
        install_date: installDate,
        status: status,
        installed_by: 1,
        remarks: remarks,
      },
    ]);

  error = result.error;
}

  if (error) {
    console.log(error);
    alert("Error while saving");
    return;
  }

  setLocation("");
  setQuantity(1);
  setRemarks("");

if (!editId && inventoryData) {
  await supabase
    .from("inventory")
    .update({
      quantity_issued:
        Number(inventoryData.quantity_issued) +
        Number(quantity),

      quantity_available:
        Number(inventoryData.quantity_available) -
        Number(quantity),
    })
    .eq("id", inventoryData.id);
}
  loadInstallations();
  setEditId(null);
  alert("Installation Saved Successfully");
}

async function deleteInstallation(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this installation?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("equipment_installations")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Delete Failed");
    return;
  }

  loadInstallations();

  alert("Installation Deleted Successfully");
}
 function editInstallation(item) {
  console.log(item);
  setEditId(item.id);

  setSiteId(item.site_id);
  setZoneType(item.zone_type);
  setLocation(item.location);
  setEquipmentTypeId(item.equipment_type_id);
  setQuantity(item.quantity);
  setInstallDate(item.install_date);
  setStatus(item.status);
  setRemarks(item.remarks || "");
}
  return (
    <div>
      <h1>Equipment Installations</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
        }}
      >
        <h3>Add Installation</h3>

        <br />
      {user?.role !== "Engineer" && (
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
          <option value="">Select Site</option>

          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.site_name}
            </option>
          ))}
        </select>
      )}

        <br />
        <br />

        <select
          value={zoneType}
          onChange={(e) => setZoneType(e.target.value)}
        >
          <option value="Lane">Lane</option>
          <option value="Plaza">Plaza</option>
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <br />
        <br />

        <select
          value={equipmentTypeId}
          onChange={(e) =>
            setEquipmentTypeId(e.target.value)
          }
        >
          <option value="">
            Select Equipment
          </option>

          {equipmentTypes.map((equipment) => (
            <option
              key={equipment.id}
              value={equipment.id}
            >
              {equipment.equipment_name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="date"
          value={installDate}
          onChange={(e) =>
            setInstallDate(e.target.value)
          }
        />

        <br />
        <br />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <br />
        <br />

        <textarea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
        />

        <br />
        <br />

        <button onClick={saveInstallation}>
          {editId ? "Update Installation" : "Save Installation"}
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
          marginTop: "20px",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Site</th>
            <th>Zone</th>
            <th>Location</th>
            <th>Equipment</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {installations
  .filter((item) =>
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
              <td>{item.zone_type}</td>
              <td>{item.location}</td>
              <td>
                {
                  item.equipment_types
                    ?.equipment_name
                }
              </td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
              <td>{item.install_date}</td>
              <td>
               <button
                onClick={() => editInstallation(item)}
               >
                Edit
               </button>

               <button
                onClick={() =>
                  deleteInstallation(item.id)
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

export default InstallationsPage;