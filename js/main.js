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
    const linkImg = dataHome.data.seoOnPage.og_image;

    let htmls = '';
    // Tìm link truyện tương ứng với tên truyện
    dataHome.data.items.forEach((datas, index) => {
        const img = linkImg[index]; // lấy ảnh tương ứng với từng datas

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
        const linkImg = dataComic.data.seoOnPage.og_image;
        let htmls = '';
        // lấy ảnh truyện
        dataComic.data.items.forEach((item, index) => {
            const img = linkImg[index];
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

let handleRenderPagi = (range, totalPages, pageRanges) => {
    let { startPage, endPage } = range;
    // Tổng kết các biến thay đổi currentPage, startPage và endPage thay đổi theo currentPage
    let htmls = '';
    for (let i = startPage; i <= endPage; i++) {
        htmls += `
            <a href="#content" class="btn btn-sm btn-pagi" data-title="${i}" style="color: #f9fafb">${i}</a>
        `;
    }
    pagingItems.innerHTML = htmls;
    // Gán sự kiện cho từng số điều hướng
    const btnPagi = document.querySelectorAll('.btn-pagi');
    btnPagi.forEach(btn => {
        if (parseInt(btn.getAttribute('data-title')) === currentPage) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.getAttribute('data-title'));
            const range = getPaginationRange(currentPage, totalPages, pageRanges);
            handleRenderPagi(range, totalPages, pageRanges);
            // Log đúng giá trị
            // console.log(range.startPage, range.endPage);
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

