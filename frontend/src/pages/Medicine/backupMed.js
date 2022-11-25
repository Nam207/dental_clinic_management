// const refreshData = (e, med, index) => {
//   let tempMeds = [...meds];
//   let tempMed = tempMeds.find((item) => item._id === med._id);
//   tempMed = { ...tempMed, status: e.target.checked };
//   tempMeds[index] = tempMed;
//   store.dispatch(getMedicineSuccess(tempMeds));
// };

// const title = [
//   {
//     dataKey: "_id",
//     displayName: "Mã thuốc",
//   },
//   {
//     dataKey: "imageUrl",
//     displayName: "Ảnh",
//     custom: (value) => {
//       return (
//         <img src={value} style={{ height: "100px", width: "100px" }} alt="" />
//       );
//     },
//   },
//   {
//     dataKey: "name",
//     displayName: "Tên thuốc",
//   },
//   {
//     dataKey: "usage",
//     displayName: "Cách sử dụng",
//   },
//   {
//     dataKey: "status",
//     displayName: "Trạng thái",
//     custom: (value, data) => {
//       return value ? (
//         <AiOutlineCheck color="#009432" size={25} />
//       ) : (
//         <AiOutlineCloseCircle color="#EA2027" size={25} />
//       );
//     },
//   },
//   {
//     dataKey: "",
//     displayName: "",
//     fixedWidth: 500,
//     custom: (value, data) => {
//       return (
//         <>
//           <FaEdit
//             className="mx-2"
//             color="#2980b9"
//             cursor={"pointer"}
//             size={25}
//             onClick={() => {
//               openUpdateModal(data._id);
//             }}
//           />
//           <Form.Check
//             type="switch"
//             checked={data.status}
//             style={{ display: "inline", marginLeft: "10px" }}
//             onChange={async (e) => {
//               // refreshData(e, med, index);
//               const result = await medicineProcessor.changeStatus(
//                 data._id,
//                 e.target.checked
//               );
//               if (result.success === 1) {
//                 showToast(`Cập nhật id: ${data._id} thành công`, true);
//                 // setTimeout(() => {
//                 //   loadData();
//                 // },1);
//                 await loadData();
//               }
//             }}
//           />
//         </>
//       );
//     },
//   },
// ];

// function MedTable() {
//   return (
//     <>
//       <div
//         style={{
//           position: "fixed",
//           right: "10px",
//           bottom: "20px",
//           zIndex: "3",
//         }}
//       >
//         <CustomToast
//           value={isToast.value}
//           content={isToast.content}
//           isSuccess={isToast.isSuccess}
//           onClose={() => {
//             setIsToast({ ...isToast, value: false });
//           }}
//         />
//       </div>
//       <Tabs id="uncontrolled-tab-example" className="mb-3">
//         <Tab eventKey="profile" title="Tất cả">
//           <div style={{ marginLeft: "100px", marginRight: "100px" }}>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Control
//                   placeholder="Tìm kiếm"
//                   autoFocus
//                   value={searchMeds}
//                   onChange={handleSearch}
//                 />
//               </Form.Group>
//             </Form>

//             <CustomTable data={meds} title={title} />
//           </div>
//         </Tab>
//       </Tabs>
//     </>
//   );
// }
