// Hàm chia chuỗi url với mỗi dấu / để lấy id 
let getId = (link) => {
    if (!link || typeof link !== 'string') return '';
    const parts = link.split('/');
    return parts[parts.length - 1];
};
const apiHome = 'https://otruyenapi.com/v1/api/home';
let renderHome = (api, handleData) => {
    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            handleData(data);
            console.log(`Tải trang chủ thành công`);
        })
        .catch(error => {
            console.log(`Tải trang chủ thất bại lỗi: ${error}`)
        })
}
const slideShow = document.querySelector('.slide-show');
const slide = document.querySelector('.slide');
// Render slideShow
renderHome(apiHome, (dataHome) => {
    const linkStart = dataHome.data.APP_DOMAIN_CDN_IMAGE;
    let htmls = '';
    // Tìm link truyện tương ứng với tên truyện
    dataHome.data.items.forEach((datas, index) => {
        const img = dataHome.data.seoOnPage.og_image[index]; // lấy ảnh tương ứng với từng datas

        htmls += `
            <a href="detail.html?slug=${datas.slug}" class="p-0">
                <img src="${linkStart}${img}" alt="anh_loi" class="img-slide" />
            </a>
        `;
    });
    slide.innerHTML = htmls;
    //Slideshow
    const imgSlide = document.querySelectorAll('.img-slide');
    let current = 0;
    setInterval(() => {
        const widthSlide = imgSlide[0].offsetWidth;
        if (current === imgSlide.length - 1) {
            current = 0;
            slide.style.transform = `translateX(0px)`;
        }
        else {
            current++;
            slide.style.transform = `translateX(${-widthSlide * current}px)`;
        }
    }, 3000)
});

//Phần truyện mới ở trang home
const mainComic = document.querySelector('.main-comic');
//Api truyện
const apiComic = "https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=";

let render = (current) => {
    //lấy thông tin chuyện
    renderHome(`${apiComic}${current}`, (dataComic) => {
        // document.title = dataComic.data.titlePage;
        const domainImg = dataComic.data.APP_DOMAIN_CDN_IMAGE;
        let htmls = '';
        // lấy ảnh truyện
        dataComic.data.items.forEach((item, index) => {
            const img = dataComic.data.seoOnPage.og_image[index];
            htmls += `
                <div class="col-xl-2 col-md-3 col-sm-4 col-6">
                    <a href="detail.html?slug=${item.slug}" class="d-block my-3 text-decoration-none">
                        <div class="">
                            <img src="${domainImg}${img}" alt="anh_loi" class="img-comic rounded">
                        </div>
                        <div class="comic-des">
                            <div class="fs-6 my-2 div2-lines" style="color: #ffffffc9">${item.name}</div>
                            ${item.category.map(car => {
                return `<div class="badge rounded-pill bg-primary">${car.name}</div>`
            }).join('')
                }
                        </div>
                    </a>
                </div>
            `;
        });
        mainComic.innerHTML = htmls;
    });
}

render(1);

const pagingItems = document.querySelector('.paging-items');
// Biến xác định vị trí trang 
let currentPage = 1;

// Hàm gọi lại mỗi lần chuyển trang 
let getPaginationRange = (currentPage, totalPages, pageRanges) => {
    let startPage, endPage;
    // Nếu tổng số trang <= số trang hiển thị mặc định thì thì startPage = 1, endPage = totalPages
    if (totalPages <= pageRanges) {
        startPage = 1;
        endPage = totalPages;
    }
    // hoặc nếu biến di chuyển currentPage ở vị trí <= Math.ceil(pageRanges / 2)
    //  (3 số đầu 1,2,3)  thì startPage = 1 và endPage = pageRanges(tức là = 5) 
    else if (currentPage <= Math.ceil(pageRanges / 2)) {
        startPage = 1;
        endPage = pageRanges;
    }
    // hoặc nếu các currentPage ở vị trí totalPages - Math.floor(pageRanges / 2)(tức là vị trí cuối)
    // thì sẽ hiển thị pageRanges nút cuối cùng luôn
    else if (currentPage >= totalPages - Math.floor(pageRanges / 2)) {
        startPage = totalPages - (pageRanges - 1);
        endPage = totalPages;
    }
    // Nếu tổng số trang > số trang hiển thị mặc định thì di chuyển bình thường
    else {
        startPage = currentPage - Math.floor(pageRanges / 2);
        endPage = currentPage + Math.floor(pageRanges / 2);
    }

    return { startPage, endPage };
}
// render paging
let handleRenderPagi = (range, totalPages, pageRanges) => {
    let { startPage, endPage } = range;
    const pagingFirst = document.querySelector('.paging-first');
    const pagingEnd = document.querySelector('.paging-end');
    // Tổng kết các biến thay đổi currentPage, startPage và endPage thay đổi theo currentPage
    let htmls = '';
    for (let i = startPage; i <= endPage; i++) {
        htmls += `
            <a href="#content" class="btn btn-sm btn-pagi" data-title="${i}" style="color: #f9fafb">${i}</a>
        `;
    }
    pagingItems.innerHTML = htmls;

    // Xử lý nút pagi first/end
    pagingFirst.innerHTML = `
        <a href="#content" class="btn btn-sm btn-pagi" data-titles="${1}" style="color: #f9fafb">
            <svg xmlns="http://www.w3.org/2000/svg" class="paging-icon"
                viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path
                d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7 288 416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7 64 416c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 96C0 78.3 14.3 64 32 64s32 14.3 32 32l0 118.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96l0 118.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96l0 320c0 12.4-7.2 23.7-18.4 29z" />
            </svg>
        </a>
    `;
    pagingEnd.innerHTML = `
        <a href="#content" class="btn btn-sm btn-pagi" data-titles="${totalPages}" style="color: #f9fafb">
            <svg xmlns="http://www.w3.org/2000/svg" class="paging-icon"
                viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path
                d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7 224 416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7 448 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 118.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96l0 118.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96L0 416c0 12.4 7.2 23.7 18.4 29z" />
            </svg>
        </a>
    `;
    pagingFirst.classList.toggle('disabled', currentPage < 4);
    pagingEnd.classList.toggle('disabled', currentPage >= totalPages - 2);
    // Gán sự kiện cho từng số điều hướng
    const btnPagi = document.querySelectorAll('.btn-pagi');
    btnPagi.forEach(btn => {
        if (parseInt(btn.getAttribute('data-title')) === currentPage) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.getAttribute('data-title')) || parseInt(e.target.getAttribute('data-titles'));
            const range = getPaginationRange(currentPage, totalPages, pageRanges);
            handleRenderPagi(range, totalPages, pageRanges);
            render(currentPage);
        })
    })
}

//Lấy các trang truyện để điều hướng
renderHome(apiHome, (dataPagi) => {
    const pagi = dataPagi.data.params.pagination;
    // Lấy tổng số trang = tổng số bài viết / tổng số bài viết của mỗi trang 
    let totalPages = Math.ceil(pagi.totalItems / pagi.totalItemsPerPage);
    // Hiển thị mặc định là 5 trang 
    let pageRanges = pagi.pageRanges;

    const range = getPaginationRange(currentPage, totalPages, pageRanges);
    handleRenderPagi(range, totalPages, pageRanges);

})
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
                    ? `content.html?api=${getId(item?.chaptersLatest?.[0]?.chapter_api_data || '')}&slug=${item.slug}`
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

