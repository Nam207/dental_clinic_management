// function CustomerTable() {
//     return (
//       <>

//         <Tabs id="uncontrolled-tab-example" className="mb-3">
//           {/* <Tab eventKey="http://localhost:3000/pathological1" title="Home">
//           asd
//         </Tab> */}

//           <Tab eventKey="profile" title="Tất cả">
//             <div style={{ marginLeft: "100px", marginRight: "100px" }}>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Control placeholder="Tìm kiếm" />
//                 </Form.Group>
//               </Form>

//               <CustomTable data={customers} title={title} />
//             </div>
//           </Tab>
//         </Tabs>
//       </>
//     );
//   }

//   const title = [
//     {
//       dataKey: "_id",
//       displayName: "Mã khách hàng",
//     },
//     {
//       dataKey: "fullname",
//       displayName: "Tên khách hàng",
//     },
//     {
//       dataKey: "phone",
//       displayName: "Điện thoại",
//     },
//     {
//       dataKey: "address",
//       displayName: "Địa chỉ",
//     },
//     {
//       dataKey: "status",
//       displayName: "Trạng thái",
//       custom: (value, data) => {
//         return value ? (
//           <AiOutlineCheck color="#009432" size={25} />
//         ) : (
//           <AiOutlineCloseCircle color="#EA2027" size={25} />
//         );
//       },
//     },
//     {
//       dataKey: "",
//       displayName: "",
//       fixedWidth: 500,
//       custom: (value, data) => {
//         return (
//           <>
//             <FaEdit
//               className="mx-2"
//               color="#2980b9"
//               cursor={"pointer"}
//               size={25}
//               onClick={() => {
//                 openUpdateModal(data._id);
//               }}
//             />
//             <Form.Check
//               type="switch"
//               checked={data.status}
//               style={{ display: "inline", marginLeft: "10px" }}
//               onChange={async (e) => {
//                 // refreshData(e, med, index);
//                 const result = await customerProcessor.changeStatus(
//                   data._id,
//                   e.target.checked
//                 );
//                 if (result.success === 1) {
//                   showToast(`Cập nhật id: ${data._id} thành công`, true);
//                   // setTimeout(() => {
//                   //   loadData();
//                   // },1);
//                   loadData();
//                 }
//               }}
//             />
//           </>
//         );
//       },
//     },
//   ];
