import "./Page404.css";
import React from "react";
function Page404() {
  

  return (
    <section className="page_404">
	<div className="container">
		<div className="row">	
		<div className="col-sm-12 ">
		<div className="col-sm-12 col-sm-offset-1  text-center">
		<div className="four_zero_four_bg" style={{marginTop:"50px"}}>
			<h1 className="text-center ">404</h1>
		
		
		</div>
		
		<div className="contant_box_404">
		<h3 className="h2">
		Không tìm thấy
		</h3>
		
		<p>Thật không may trang bạn.Bạn không có quyền vào trang này.Hãy quay lại trang chính!! </p>
		
		<a href="/DashBoard" className="link_404">Trang chính</a>
	</div>
		</div>
		</div>
		</div>
	</div>
</section>
  );
}

export default Page404;
