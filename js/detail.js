const params = new URLSearchParams(window.location.search);
let slug = params.get('slug');
const apiDetail = `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`;
// Hàm chia chuỗi url với mỗi dấu / để lấy id 
let getIdDetail = (link) => {
    if (!link || typeof link !== 'string') return '';
    const parts = link.split('/');
    return parts[parts.length - 1];
};
let renderHome = (api, handleData) => {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            handleData(data);
        })
        .catch(error => {
            console.log(`Lỗi: ${error}`)
        })
}
// Kiểm tra slug để tránh lỗi khi không có tham số slug
if (slug) {
    fetch(apiDetail)
        .then(response => response.json())
        .then(data => {
            document.title = data.data.item.name;
            handleDetail(data);
            console.log(`Tải truyện thành công`);
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu chi tiết:', error);
        });
} else {
    console.error('Không có tham số slug trong URL');
}

// render chapter
let renderChapter = (array) => {
    //Hiển thị chapter
    let htmls = '';
    array.forEach((chap) => {
        htmls += `
                <div class="chapter-item col-4 p-2">
                    <a href="content.html?api=${getIdDetail(chap.chapter_api_data)}&slug=${slug}"
                        class="section_chapter btn btn-sm text-white w-100" style="background-color: var(--bg-btn)">
                        <div class="d-flex align-items-center">
                            <div class="me-3 eye-icon d-flex align-items-center justify-content-center rounded">
                                <svg viewBox="0 0 24 24" class="v-icon-svg v-icon-svg-med">
                                    <path d="M12 4.5A11.8 11.8 0 0 0 1 12A11.8 11.8 0 0 0 12 19.5H13.1A3.8 3.8 0 0 1 13 18.5A4.1 4.1 0 0 1 13.1 17.4H12A9.6 9.6 0 0 1 3.2 12A9.6 9.6 0 0 1 12 6.5A9.6 9.6 0 0 1 20.8 12L20.4 12.7A4.6 4.6 0 0 1 22.3 13.5A10.1 10.1 0 0 0 23 12A11.8 11.8 0 0 0 12 4.5M12 9A3 3 0 1 0 15 12A2.9 2.9 0 0 0 12 9M15 17.5V19.5H23V17.5Z"></path>
                                </svg>
                            </div>
                            <div class="fs-6">#${chap.chapter_name}</div>
                        </div>
                    </a>
                </div>
                
            `;
    });
    return htmls;
}
// Hàm load chap theo số lượng
let loadChap = (quantity, allChapter) => {
    if (!allChapter || typeof allChapter !== 'object') return '';
    let chaptersToShow = allChapter.slice(0, quantity);
    return renderChapter(chaptersToShow);
}

// render ảnh và chapter
let handleDetail = (dataDetail => {
    const imgDetail = dataDetail.data.seoOnPage.seoSchema.image;
    const imgDiv = document.querySelector('.imgDiv');
    const chapter = document.querySelector('.chapter');
    const startChapter = document.querySelector('.start-chapter');
    const comicHeader = document.querySelector('.comic-header');
    const infoSection = document.querySelector('.info-setion');
    // Hiển thị phần đầu của giới thiệu truyện trang detail
    comicHeader.innerHTML = `
        <h4 class="text-white pt-2">${dataDetail.data.item.name}</h4>
        <div class="py-2">
            ${dataDetail.data.item.category.map(cate =>
        `<a href = "" class="btn badge rounded-pill text-bg-secondary fw-normal me-2">
                        <svg viewBox="0 0 24 24" class="v-icon-svg-small">
                            <path d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z"></path>
                        </svg>
                        ${cate.name}
                    </a>`
    ).join('')
        }
        </div>
        <div class="py-2 text-white">
            ${dataDetail.data.seoOnPage.descriptionHead}
        </div>
    `;
    // Biến lưu trạng thái của truyện từ api
    let status = dataDetail.data.item.status;
    // Chuyển giá trị status sang tiếng Việt
    let statusText = '';
    switch (status) {
        case 'ongoing':
            statusText = '<span style="color: #18e390">Đang phát hành</span>';
            break;
        case 'completed':
            statusText = '<span style="color: #00bcd4">Đã hoàn thành</span>';
            break;
        case 'paused':
            statusText = '<span style="color: #ffc107">Tạm dừng</span>';
            break;
        case 'cancelled':
            statusText = '<span style="color: #f44336">Đã hủy bỏ</span>';
            break;
        default:
            statusText = '<span style="color: #9e9e9e">Không rõ</span>';
            break;
    }
    // Hiển thị phần thông tin truyện
    infoSection.innerHTML = `
        <div class="py-2">
            <div class="text-secondary fs-6">TÁC GIẢ: 
                <span style="color:#18e390">${dataDetail.data.item.author}</span>
            </div>
            <div class="text-secondary fs-6">TRẠNG THÁI: 
                ${statusText}
            </div>
        </div>
    `;
    let linkchap = dataDetail.data.item.chapters;
    // Hiển thị ảnh
    imgDiv.innerHTML = `<img src="${imgDetail}" alt="anh_loi" class="rounded w-100"></img>`
    startChapter.innerHTML = `
            <a href="content.html?api=${getIdDetail(linkchap?.[0]?.server_data?.[0]?.chapter_api_data)}"
                class="btn text-white py-2 w-100 btn-sm" style="background-color: var(--bg-btn);">
                Đọc từ đầu
            </a>
        `;
    // gọi hàm loadChap() để load chap theo số lượng nhất định
    chapter.innerHTML = loadChap(21, linkchap?.[0]?.server_data);
    const btnLoadAll = document.querySelector('.btn-loadAll');
    // Hàm xử lý sự kiện click vào nút "Xem tất cả"
    const handleClick = () => {
        chapter.innerHTML = "";
        btnLoadAll.classList.toggle('active');
        if (btnLoadAll.classList.contains('active')) {
            chapter.innerHTML = renderChapter(linkchap[0]?.server_data);
            btnLoadAll.innerText = 'THU GỌN';
        }
        else {
            chapter.innerHTML = loadChap(21, linkchap[0]?.server_data);
            btnLoadAll.innerText = 'HIỂN THỊ TẤT CẢ';
        }
    }

    btnLoadAll.addEventListener('click', handleClick);
    // Hủy  nút "Xem tất cả" nếu không có chương nào
    if (linkchap.length == 0) {
        btnLoadAll.innerText = 'Đang cập nhật các chương';
        btnLoadAll.removeEventListener('click', handleClick);
    }else if(linkchap[0]?.server_data.length == 21){
        btnLoadAll.classList.add('d-none');
    }
});
// Xử lý phần tìm kiếm ở trang home
const navSearch = document.querySelector('.nav-search');//nút tìm kiếm
const dialogHome = document.querySelector('.dialog-home');//Khối hiện lên khi ấn vào nút tìm kiếm
const btnExit = document.querySelector('.btn-exit');//Nút thoát khối tìm kiếm
const dialogContainer = document.querySelector('.dialog-container');//Khối bao quanh khối tìm kiếm
//Khi ấn vào icon tìm kiếm thì hiện khối tìm kiếm
navSearch.addEventListener('click', () => {
    dialogHome.classList.add('active');
    document.body.style.overflowY = 'hidden';
    //Đóng khối tìm kiếm cho icon "X"
    btnExit.addEventListener('click', () => {
        dialogHome.classList.remove('active');
        document.body.style.overflowY = 'visible';
    })
    // Đóng khối tìm kiếm khi ấn phần bao quanh khối tìm kiếm
    dialogHome.addEventListener('mousedown', () => {
        dialogHome.classList.remove('active');
        document.body.style.overflowY = 'visible';
    })
    // Ngăn chặn sự nổi bọt
    dialogContainer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    })
    // Hàm trả về kết quả tìm kiếm
    let searchResult = (dataSearch) => {
        let htmls = '';
        htmls = dataSearch.data.items.map(item => {
            // nếu tồn tại item.chaptersLatest thì tạo ra url
            const urlLastChapter =
                item.chaptersLatest
                    ? `content.html?api=${getIdDetail(item?.chaptersLatest?.[0]?.chapter_api_data || '')}&slug=${item.slug}`
                    : '';
            return `
                    <div class="item row p-0 m-1">
                        <div class="col-3 p-1">
                            <a href="detail.html?slug=${item.slug}" class="image_search">
                                <img src="https://img.otruyenapi.com/uploads/comics/${item.thumb_url}" alt="">
                            </a>
                        </div>
                        <div class="col-9">
                            <div class="info d-flex flex-column justify-content-between" style="height: 95px;">
                                <a href="detail.html?slug=${item.slug}" class="flex-grow-1 text-decoration-none">
                                    <span class="div2-lines name">${item.name}</span>
                                </a>
                                <a href="${urlLastChapter}" data-url="${urlLastChapter}" class="chapter text-decoration-none">Chương ${item?.chaptersLatest?.[0]?.chapter_name || ': Đang cập nhật'}</a>
                            </div>
                        </div>
                    </div>
                `
        }).join('');

        return htmls;
    }

    // Lấy giữ liệu nhập từ người dùng ở ô tìm kiếm
    const searchDialog = document.querySelector('.search-dialog');// ô tìm kiếm
    // Biến keyword
    let key = '';
    //Biến lưu id của setTimeout
    //Hàm lấy dữ liệu ô tìm kiếm
    let id;
    const handleSearch = (e) => {
        console.log(1)
        key = e.target.value;
        clearTimeout(id);
        //Gọi api mỗi 3 giây để lấy dữ liệu
        id = setTimeout(() => {
            callSearchApi();
        }, 300)
    }
    searchDialog.addEventListener('input', handleSearch);
    // Phần hiển thị kết quả tìm kiếm
    const dialogBody = document.querySelector('.dialog-body');
    //Hàm gọi api để lấy dữ liệu
    const callSearchApi = () => {
        const apiSearch = `https://otruyenapi.com/v1/api/tim-kiem?keyword=${key}`;
        renderHome(apiSearch, (dataSearch) => {
            //Gọi hàm kết quả tìm kiếm và chèn vào trong khối dialogBody
            dialogBody.innerHTML = searchResult(dataSearch);
            const chapters = document.querySelectorAll('.chapter');
            chapters.forEach(chapter => {
                //Nếu chương nào không có chap thì vô hiệu hóa tương tác
                chapter.classList.toggle('pointer-events-none',  )
                //Ngăn chặn sự nổi bọt sự kiện click ra thẻ cha
                chapter.addEventListener('click', (e)=>{
                    if(chapter.getAttribute('data-url') == ''){
                        e.preventDefault();
                    }
                })
            })
        })
    }
    callSearchApi();

})