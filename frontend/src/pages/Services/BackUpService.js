// const ServiceTable = ({ currentItems }) => {
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
//                   value={searchSers}
//                   onChange={handleSearch}
//                 />
//               </Form.Group>
//             </Form>
//             <Table striped bordered hover>
//               <thead>
//                 <tr
//                   style={{
//                     textAlign: "center",
//                   }}
//                 >
//                   <th>Mã thủ thuật</th>
//                   <th>Ảnh</th>
//                   <th>Tên thủ thuật</th>
//                   <th>Giá</th>
//                   <th>Status</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((service, index) => {
//                   return (
//                     <tr
//                       key={index}
//                       style={{
//                         textAlign: "center",
//                       }}
//                     >
//                       <td>{service._id}</td>
//                       <td>
//                         <img
//                           style={{ height: "100px", width: "100px" }}
//                           src={service.imageUrl}
//                           alt=""
//                         />
//                       </td>
//                       <td>{service.name}</td>
//                       <td>{service.price?.$numberDecimal}</td>
//                       <td>
//                         {service.status ? (
//                           <AiOutlineCheck color="#009432" size={25} />
//                         ) : (
//                           <AiOutlineCloseCircle color="#EA2027" size={25} />
//                         )}
//                       </td>
//                       <td>
//                         <FaEdit
//                           className="mx-2"
//                           color="#2980b9"
//                           cursor={"pointer"}
//                           size={25}
//                           onClick={() => {
//                             setServiceId(service._id);
//                             openUpdateModal();
//                           }}
//                         />
//                         <Form.Check
//                           type="switch"
//                           checked={service.status}
//                           style={{ display: "inline", marginLeft: "10px" }}
//                           onChange={async (e) => {
//                             // refreshData(e, med, index);
//                             const result =
//                               await serviceProcessor.changeStatus(
//                                 service._id,
//                                 e.target.checked
//                               );
//                             if (result.success === 1) {
//                               showToast(
//                                 `Cập nhật id: ${service._id} thành công`,
//                                 true
//                               );
//                               // setTimeout(() => {
//                               //   loadData();
//                               // },1);
//                               await loadData();
//                             }
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </Tab>
//       </Tabs>
//     </>
//   );
// };
