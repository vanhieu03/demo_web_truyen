const content = document.querySelector('.content');

const params = new URLSearchParams(window.location.search);
let api = params.get('api');
let slug = params.get('slug');
const apiDetail = `https://sv1.otruyencdn.com/v1/api/chapter/${api}`;
// Hàm lấy id của từng chapter
let getIdContent = (link) => {
    const parts = link.split('/');
    return parts[parts.length - 1];
}
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

if (api) {
    fetch(apiDetail)
        .then(response => response.json())
        .then(data => {
            renderContent(data);
            console.log(`Tải truyện thành công`);
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu chi tiết:', error);
        });
} else {
    console.error('Không có tham số slug trong URL');
}

let renderChap = (domain, linkImg) => {
    let htmls = '';
    linkImg.forEach(link => {
        htmls += `
            <img src="${domain}${link.image_file}" alt="anh_loi" class="d-block w-100">
        `
    })
    return htmls;
}
// Mảng lưu trữ các chapter
let chapters = [];
// Gọi api để lấy tất cả chapter
fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
    .then(res => res.json())
    .then(data => {
        chapters = data.data.item.chapters[0].server_data;
        handleNav(chapters)
    })
    .catch(er => {
        console.log(`Lỗi ${er}`);
    })
//Hàm xử lý phần nav chuyển từng chapter
let handleNav = (chapters) => {
    const navPrev = document.querySelector('.nav-prev');
    const navNext = document.querySelector('.nav-next');
    // Tìm vị trí chap hiện tại
    const currentChap = chapters.findIndex(chap =>
        chap.chapter_api_data === apiDetail
    )
    // Xử lý phần hiển thị các nút khi ở chap đầu hoặc chap cuối
    // Hàm xử lý trạng thái của nút
    const toggleButtonState = () => {
        navPrev.classList.toggle('text-disabled', currentChap === 0);
        navNext.classList.toggle('text-disabled', currentChap === chapters.length - 1);
    }
    toggleButtonState();
    // Xử lý nút trước
    navPrev.addEventListener('click', () => {
        if (currentChap > 0) {
            let id = getIdContent(chapters[currentChap - 1].chapter_api_data);
            window.location.href = `content.html?api=${encodeURIComponent(id)}&slug=${slug}`;
        }
    })
    // Xử lý nút sau
    navNext.addEventListener('click', () => {
        if (currentChap < chapters.length - 1) {
            let id = getIdContent(chapters[currentChap + 1].chapter_api_data);
            window.location.href = `content.html?api=${encodeURIComponent(id)}&slug=${slug}`;
        }
    })
    // Xử lý phần chương trên nav
    const navList = document.querySelector('.nav-list');
    const dialog = document.querySelector('.dialog');
    const dialogBox = document.querySelector('.dialog-box');
    const dialogList = document.querySelector('.dialog-list');
    //Kiểm soát sự kiện click
    dialogList.addEventListener('mousedown', e => {
        e.stopPropagation();
    })
    //Xử lý phần hiển thị khi ấn vào chương
    navList.addEventListener('click', () => {
        dialogBox.classList.toggle('active');
        document.body.style.overflowY = 'hidden';
        const btnClose = document.querySelector('.btn-close');
        btnClose.addEventListener('click', (e) => {
            document.body.style.overflowY = 'visible';
            dialogBox.classList.remove('active');
        })
    })
    dialogBox.addEventListener('mousedown', () => {
        dialogBox.classList.toggle('active');
        document.body.style.overflowY = 'visible';
    })
    // Hàm hiển thị tất cả các chương
    let loadChap = (chapters) => {
        let htmls = '';
        htmls = chapters.map((chap, index) => {
            return `<a href="content.html?api=${getIdContent(chap.chapter_api_data)}&slug=${slug}"
                    class="btn-chapter col-2 btn btn-sm text-white m-2
                    ${index === currentChap ? 'active-chapter' : ''}">
                    ${chap.chapter_name}
                </a>`
        }).join('')
        return htmls;
    }
    dialog.innerHTML = loadChap(chapters);
    //Xử lý sự kiện tìm kiếm
    //Khối tìm kiếm
    const searchContent = document.querySelector('.search-content');
    //Biến lưu từ khóa
    let keyContent = '';
    //Hàm tìm kiếm chương
    let handleSearchContent = (e) => {
        keyContent = e.target.value;
        const btnChapter = Array.from(document.querySelectorAll('.btn-chapter'));
        // Nếu không nhập gì → hiện tất cả
        if (keyContent === "") {
            btnChapter.forEach(btn => btn.classList.remove('disabled'));
            return;
        }

        // Tìm nút chính xác
        let arNew = btnChapter.filter(btn => btn.innerText.trim() === keyContent.trim());

        btnChapter.forEach(btn => {
            if (arNew.includes(btn)) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
        });
    }

    searchContent.addEventListener('input', handleSearchContent);
    // Xử lý khi cuộn chuột lên / xuống

    const topMovePannel = document.querySelector('.top-move-pannel');
    const content = document.querySelector('.content');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const contentTopInViewport = content.getBoundingClientRect().top;
        const isScrollingUp = window.scrollY < lastScrollY;
        const isScrollingDown = window.scrollY > lastScrollY;

        // Nếu content đã bị cuộn ra khỏi màn hình (lên trên) và đang cuộn lên
        if (contentTopInViewport <= 0 && isScrollingUp) {
            topMovePannel.classList.add('pannel-top');
        }

        // Nếu đang ở trên đầu trang → ẩn đi
        if (window.scrollY <= contentTopInViewport) {
            topMovePannel.classList.remove('pannel-top');
        }

        // Nếu đang cuộn xuống thì ẩn panel
        if (contentTopInViewport <= 0 && isScrollingDown) {
            topMovePannel.classList.remove('pannel-top');
        }

        lastScrollY = window.scrollY;
    });
}

// hàm render nội dung trang
let renderContent = (dataContent) => {
    const domain = `${dataContent.data.domain_cdn}/${dataContent.data.item.chapter_path}/`;
    const linkImg = dataContent.data.item.chapter_image;
    const headerContent = document.querySelector('.header-content');
    // Render breadcrumb
    headerContent.innerHTML = `
        <nav class="btn w-100" style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 d-flex justify-content-center align-items-center">
                <li class="breadcrumb-item"><a href="index.html" class="breadcrumb-list text-danger text-decoration-none small">Trang chủ</a></li>
                <li class="breadcrumb-item"><a href="detail.html?slug=${slug}" class="breadcrumb-list text-danger text-decoration-none small">${dataContent.data.item.comic_name}</a></li>
                <li class="breadcrumb-item active text-danger breadcrumb-list small" aria-current="page">Chương #${dataContent.data.item.chapter_name}</li>
            </ol>
        </nav>
    `;

    content.innerHTML = renderChap(domain, linkImg);
};

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
                    ? `content.html?api=${getIdContent(item?.chaptersLatest?.[0]?.chapter_api_data || '')}&slug=${item.slug}`
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
                chapter.classList.toggle('pointer-events-none',)
                //Ngăn chặn sự nổi bọt sự kiện click ra thẻ cha
                chapter.addEventListener('click', (e) => {
                    if (chapter.getAttribute('data-url') == '') {
                        e.preventDefault();
                    }
                })
            })
        })
    }
    callSearchApi();

})