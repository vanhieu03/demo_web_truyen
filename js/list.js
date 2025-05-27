const apiCate = 'https://otruyenapi.com/v1/api/the-loai';
//Hàm gọi api và xử lý dữ liệu trả về
let callCate = (api, handleData) => {
    fetch(api)
        .then(res => res.json())
        .then(data => {
            handleData(data);
            console.log("Thành công");
        })
        .catch(er => {
            console.log("Lỗi", er);
        })
}

//Gọi api render các thể loại truyện
callCate(apiCate, (dataCate) => {
    //Khối chứa các thể loại
    const cateContent = document.querySelector('.cate-content')
    //Hàm render các thể loại truyện
    let renderCate = (data) => {
        let linkCate = data ? data.data.items : [];
        let htmls = '';
        //Nếu có dữ liệu
        if (linkCate.length > 0) {
            htmls = linkCate.map(cate =>
                `
                    <div class="cate-items d-inline-flex align-items-center p-2 rounded mb-1">
                        <svg viewBox="0 0 24 24" role="img" aria-hidden="true" class="icon-check"><path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"></path></svg>
                        <div class="text rounded px-2">${cate.name}</div>
                    </div>
                `
            ).join('')
        }

        return htmls;
    }
    cateContent.innerHTML = renderCate(dataCate);
    //Khối bao quanh ô tích và tên thể loại
    const cateItems = document.querySelectorAll('.cate-items')
    //Khối ô tích
    const iconCheck = document.querySelectorAll('.icon-check');
    //icon tích 
    const icon1 = `<path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"></path>`;
    const icon2 = `<path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z"></path>`;
    //Khối text chứa tên của thể loại
    const text = document.querySelectorAll('.cate-items .text');
    let textClick = [];
    //Click vào ô bao quanh thì đổi icon trên từ ô thành tích
    cateItems.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            //Khi tích
            if (iconCheck[index].innerHTML == icon1) {
                iconCheck[index].innerHTML = icon2;
                textClick.push(text[index].innerText);
            }
            //Ngược lại
            else if (iconCheck[index].innerHTML == icon2) {
                //Xóa tất cả phần tử không tích trong mảng textclick
                textClick = textClick.filter(t => t !== text[index].innerText);
                iconCheck[index].innerHTML = icon1;
            }
            handleSearch(textClick);
            //Đổi màu bg và color
            btn.classList.toggle('active', iconCheck[index].innerHTML == icon2)
        })
    })
    //Hàm xử lý khi search nhận arrText là hàm chứa các thể loại cần tìm 
    let handleSearch = (arrText) => {
        //Nút tìm kiếm
        const btnSearchCate = document.querySelector('.btnSearch-cate');
        //Khi tìm kiếm
        btnSearchCate.addEventListener('click', () => {
            //Tìm các thể loại trong arrText = thể loại trong dữ liệu
            arrText.forEach(text =>{
                dataCate.data.items.forEach(item =>{
                    if(text == item.name){
                        //render các thẻ có cùng thể loại
                        console.log(text)
                    }
                })
            })
        })
    }

})