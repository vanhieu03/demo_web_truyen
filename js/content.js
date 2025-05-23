const content = document.querySelector('.content');

const params = new URLSearchParams(window.location.search);
let api = params.get('api');
let slug = params.get('slug');
const apiDetail = `https://sv1.otruyencdn.com/v1/api/chapter/${api}`;
// Hàm lấy id của từng chapter
let getId = (link) => {
    const parts = link.split('/');
    return parts[parts.length - 1];
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
            <img src="${domain}${link.image_file}" alt="anh_loi" class="d-block">
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
            let id = getId(chapters[currentChap - 1].chapter_api_data);
            window.location.href = `content.html?api=${encodeURIComponent(id)}&slug=${slug}`;
        }
    })
    // Xử lý nút sau
    navNext.addEventListener('click', () => {
        if (currentChap < chapters.length - 1) {
            let id = getId(chapters[currentChap + 1].chapter_api_data);
            window.location.href = `content.html?api=${encodeURIComponent(id)}&slug=${slug}`;
        }
    })
    // Xử lý phần chương trên nav
    const navList = document.querySelector('.nav-list');
    const dialog = document.querySelector('.dialog');
    const dialogBox = document.querySelector('.dialog-box');
    const dialogList = document.querySelector('.dialog-list');
    //Kiểm soát sự kiện click
    dialogList.addEventListener('mousedown', e =>{
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
    // Hiển thị tất cả các chương
    let htmls = '';
    htmls = chapters.map((chap, index) => {
        return `<a href="content.html?api=${getId(chap.chapter_api_data)}&slug=${slug}"
                    class="btn-chapter col-2 btn btn-sm text-white m-2
                    ${index === currentChap ? 'active-chapter' : ''}">
                    ${chap.chapter_name}
                </a>`
    }).join('')
    dialog.innerHTML = htmls;
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

