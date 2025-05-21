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
    //Xử lý phần hiển thị khi ấn vào chương
    navList.addEventListener('click', () => {
        dialogBox.classList.toggle('active');
        document.body.style.overflowY = 'hidden';
        const btnClose = document.querySelector('.btn-close');
        btnClose.addEventListener('click', (e) => {
            document.body.style.overflowY = 'visible';
            dialogBox.classList.remove('active');
            e.stopPropagation();
        })
    })
    dialogBox.addEventListener('click', () => {
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
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            console.log('Đang cuộn xuống');
        } else if (event.deltaY < 0) {
            console.log('Đang cuộn lên');
        }
    });
}

// hàm render nội dung trang
let renderContent = (dataContent) => {
    const domain = `${dataContent.data.domain_cdn}/${dataContent.data.item.chapter_path}/`;
    const linkImg = dataContent.data.item.chapter_image;
    const headerContent = document.querySelector('.header-content');
    // Render breadcrumb
    headerContent.innerHTML = `
        <nav class="btn w-100 py-2" style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 d-flex justify-content-center">
                <li class="breadcrumb-item"><a href="index.html" class="breadcrumb-list text-danger text-decoration-none">Trang chủ</a></li>
                <li class="breadcrumb-item"><a href="detail.html?slug=${slug}" class="breadcrumb-list text-danger text-decoration-none">${dataContent.data.item.comic_name}</a></li>
                <li class="breadcrumb-item active text-danger breadcrumb-list" aria-current="page">Chương #${dataContent.data.item.chapter_name}</li>
            </ol>
        </nav>
    `;

    content.innerHTML = renderChap(domain, linkImg);
};

