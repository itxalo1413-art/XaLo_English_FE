import React, { useState } from 'react';
import Section from '../components/common/Section';
import AchievementCard from '../components/features/AchievementCard';
import slider_khac from '../assets/slider/sliderKhac.png'


const AchievementsPage = () => {
    const [activeTab, setActiveTab] = useState('1-on-1');

    const achievements = [
        // LỚP 1 ON 1
        {
            name: "Huỳnh Khánh Vân",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-huynh-khanh-van.png",
            input: { "Đầu vào": "4.5", "Listening": "5.5", "Reading": "6.0" },
            output: { "Điểm Overall": "6.0", "Writing": "5.5", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "48h trong 02 tháng",
            quote: "Mình tăng band từ 4.5 lên 6.0 và GV dạy rất okee.",
            category: "1-on-1"
        },
        {
            name: "Lê Mai Khanh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-mai-khanh.png",
            input: { "Đầu vào": "6.5", "Listening": "8.0", "Reading": "6.5" },
            output: { "Điểm Overall": "7.0", "Writing": "6.0", "Speaking": "7.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "32h trong 02 tháng",
            quote: "Dạ anh quân dạy okiela lắm á anh, có điều là do em thi hơi gấp nên là anh cug đi khá là nhanh, nma overall thì mọi thứ đều tốt hết á anh :3",
            category: "1-on-1"
        },
        {
            name: "Lê Nguyễn Mỹ Liên",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-nguyen-my-liennn.png",
            input: { "Listening": "7.5", "Reading": "7.0" },
            output: { "Điểm Overall": "6.5", "Writing": "6.0", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "24h trong 01 tháng",
            quote: "",
            category: "1-on-1"
        },
        {
            name: "Lê Nguyệt Minh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-nguyet-minh.png",
            input: { "Đầu vào": "6.5", "Listening": "7.0", "Reading": "8.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "16h trong 01 tháng",
            quote: "Dạ em thấy mình học được nhiều speaking ạ, em biết thêm nhiều từ mới hơn với học được cách cải thiện Speaking part 3. Còn reading em mới học được 1 buổi nhưng anh chữa bài cho em cũng rất kỹ",
            category: "1-on-1"
        },
        {
            name: "Lê Sỹ Minh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-sy-minh.png",
            input: { "Đầu vào": "5.5", "Listening": "7.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.0", "Speaking": "6.5" },
            classInfo: "IELTS 1 ON 1",
            duration: "24h trong 01 tháng",
            quote: "Khoảng thời gian học với a Hải tuy ít nhưng mà anh í cũng rất nhiệt tình trong việc hỗ trợ, đưa ra nhiều lưu ý quan trọng cũng như là các tips để đạt điểm cơ bản trong IELTS ạ! Thời gian học của em hơi gấp nhưng nhờ sự hỗ trợ hết sức của anh hải em cũng tăng được 0.5 điểm trong Writing so với lần trước em thi ạ!<br><br>Khoa thì bạn ý rất nhiệt tình cũng như luôn cố gắng giúp đỡ và hỗ trợ em trong suốt thời gian ôn tập ngắn ngủi ạ! Các tips bạn ấy đưa ra rất có ích trong khi làm bài ạ!",
            category: "1-on-1"
        },
        {
            name: "Nguyễn Ngọc Tố Trinh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/nguyen-ngoc-to-trinh.png",
            input: { "Đầu vào": "5.5", "Listening": "6.0", "Reading": "8.0" },
            output: { "Điểm Overall": "6.5", "Writing": "6.0", "Speaking": "5.5" },
            classInfo: "IELTS 1 ON 1",
            duration: "17h trong 01 tháng",
            quote: "Giảng viên dễ thương, tốc độ phù hợp, lượng kiến thực học đủ và hài lòng ạ",
            category: "1-on-1"
        },
        {
            name: "Nguyễn Thanh Thảo",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-nguyen-thi-thanh-thao.png",
            input: { "Đầu vào": "7.5", "Listening": "8.0", "Reading": "8.5" },
            output: { "Điểm Overall": "8.0", "Writing": "7.5", "Speaking": "7.0" },
            classInfo: "1 ON 1",
            duration: "17h trong 01 tháng",
            quote: "Dạ học tại Xa Lộ English okiee, không có vấn đề gì hết ạ.",
            category: "1-on-1"
        },
        {
            name: "Nguyễn Xuân Kiên",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/nguyen-xuan-kien.png",
            input: { "Listening": "6.5", "Reading": "7.0" },
            output: { "Điểm Overall": "6.5", "Writing": "6.0", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "17h trong 01 tháng",
            quote: "Thật ra thì gốc Ielts em có sẵn rồi nhưng mà từ đợt tháng 3-4 là em ôn thi đại học nên dần dần quên hết skills. Nhờ có chị Thảo mà em mới lấy lại và dùng lại được.<br>Chị Thảo ngoài học tập ra thì cũng là người hướng dẫn và là người bạn của em nữa . Thật sự thì đến cả lúc trước khi đi thi chị vẫn dành cả thời gian cho em để giúp em bình tĩnh trước khi đi thi speaking nữaa.",
            category: "1-on-1"
        },
        {
            name: "Phạm Quỳnh Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-pham-quynh-anh.png",
            input: { "Đầu vào": "6.5", "Listening": "8.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.5", "Writing": "6.5", "Speaking": "7.0" },
            classInfo: "1 ON 1 + IELTS ONLINE",
            duration: "34h trong 02 tháng (Lớp 1 ON 1) + 48h trong 02 tháng (Lớp IELTS Online)",
            quote: "Lúc đầu em đặt mục tiêu 7.0 thui mà lúc thi được hẳn 7.5 luôn ạaaa",
            category: "1-on-1"
        },
        {
            name: "Tạ Thị Hiền Nga",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/ta-thi-hien-nga.png",
            input: { "Đầu vào": "6.0", "Listening": "6.5", "Reading": "6.5" },
            output: { "Điểm Overall": "8.0", "Writing": "7.0", "Speaking": "7.0" },
            classInfo: "1 ON 1",
            duration: "34h trong 02 tháng",
            quote: "Em thấy giảng viên dạy khá nhiệt tình và dễ hiểu, do em học riêng nên chị cũng dạy theo nhu cầu của em, và em thấy khá ổn ạaa",
            category: "1-on-1"
        },
        {
            name: "Trần Nhã Quỳnh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/tran-nha-quynh.png",
            input: { "Đầu vào": "6.0", "Listening": "7.5", "Reading": "6.5" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "7.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "24h trong 01 tháng",
            quote: "",
            category: "1-on-1"
        },
        {
            name: "Trần Thanh Phú",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-tran-thanh-phu.png",
            input: { "Listening": "5.5", "Reading": "6.0" },
            output: { "Điểm Overall": "6.0", "Writing": "6.0", "Speaking": "5.5" },
            classInfo: "IELTS 1 ON 1",
            duration: "17h trong 01 tháng",
            quote: "Mình thấy khá ổn, GV hướng dẫn tốt và giúp mình nhận ra vấn đề cần cải thiện. Hiện tại đạt được kỳ vọng của mình.Năng lượng của GV cũng rất cao nhé. Cám ơn các bạn đã sắp xếp. Điểm thi đạt kỳ vọng của học viên nè.",
            category: "1-on-1"
        },
        {
            name: "Trần Thị Thảo Minh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/tran-thi-thao-minh.png",
            input: { "Đầu vào": "6.0", "Listening": "8.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.5", "Writing": "6.0", "Speaking": "7.5" },
            classInfo: "IELTS 1 ON 2",
            duration: "24h trong 01 tháng",
            quote: "anh Hiệp với anh Tông dạy em dễ hiểu lắm ạ lúc trước em siu lo lắng về writing lun mà học với anh Hiệp xong em đi thi tốt hơn nhiều ạ hì hì còn anh Tông dạy speaking tụi em siêu vui kh có bị áp lực là đang đi học gì hết chơn hehe em cũng mún gửi lời cảm ơn mọi người đã lun quan tâm giúp đỡ em quá tr lun nhee❤️‍????",
            category: "1-on-1"
        },
        {
            name: "Vũ Quỳnh Hương",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/vu-quynh-huong.png",
            input: { "Đầu vào": "7.0", "Listening": "9.0", "Reading": "8.5" },
            output: { "Điểm Overall": "8.0", "Writing": "7.0", "Speaking": "7.0" },
            classInfo: "1 ON 1",
            duration: "24h trong 01 tháng",
            quote: "Mọi thứ oke ạ",
            category: "1-on-1"
        },
        {
            name: "Đặng Huỳnh Lan",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/Dang-Huynh-Loan.png",
            input: { "Listening": "6.0", "Reading": "6.5" },
            output: { "Điểm Overall": "6.0", "Writing": "6.0", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "16h trong 02 tháng",
            quote: "Bạn nhận xét về anh Hiệp dạy kỹ và thường hỏi đi hỏi lại đến khi học viên hiểu bài nên học viên rất hài lòng.",
            category: "1-on-1"
        },
        {
            name: "Đặng Nguyễn Kiều Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/dang-nguyen-kieu-anh.png",
            input: { "Đầu vào": "7.0", "Listening": "8.0", "Reading": "8.5" },
            output: { "Điểm Overall": "7.5", "Writing": "6.0", "Speaking": "6.5" },
            classInfo: "IELTS 1 ON 1 + IELTS OFFLINE",
            duration: "36h trong 36 tuần (Lớp IELTS 1 ON 1) + 72h trong 12 tuần ( LỚP IELTS OFFLINE)",
            quote: "Dạ em thấy trong thời gian học thì được c Uyên và bạn Khoa support rất nhiệt tình, các hand out và bài giảng cũng dễ hiểu và dễ follow. Ngoài ra em cũng được cung cấp thêm nhiều tài liệu tham khảo và cũng có thêm nhiều tips để apply lúc thi ấy ạ.",
            category: "1-on-1"
        },
        {
            name: "Đặng Trần Kim Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/dang-tran-kim-anh.png",
            input: { "Đầu vào": "6.0", "Listening": "8.0", "Reading": "8.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS OFFLINE + LỚP 1 ON 3",
            duration: "72h trong 12 tuần (Lớp IELTS Offline) + 16h trong 01 tháng (Lớp 1 ON 3)",
            quote: "Em rất thích học ở đây, mí anh chị rất dth với lại nhiệt tình, kiểu mấy ac dạy với sửa bài cho bọn em rất có tâm, mỗi lần tới trung tâm là vì thích học lun í. Kiểu ac hiểu rõ điểm mạnh vs điểm yếu của tụi em để giúp em cải thiện, với điểm như vậy thì em khá là hài lòng, em mong sẽ có thể đồng hành cùng ac để đạt tới điểm cao hơn ạ ^^",
            category: "1-on-1"
        },
        {
            name: "Đỗ Ngọc Bảo Châu",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/do-ngoc-bao-chau.png",
            input: { "Đầu vào": "5.5", "Listening": "5.5", "Reading": "7.0" },
            output: { "Điểm Overall": "6.0", "Writing": "5.5", "Speaking": "6.0" },
            classInfo: "IELTS 1 ON 1",
            duration: "34h trong 02 tháng",
            quote: "Cách truyền đạt của giảng viên khiến em dễ hiểu hơn so với đợt học trước kia. Anh cũng rất tận tâm ạ. Trước đây em có từng học ở lớp kia nhưng không tiếp thu nổi những gì cô nói. Khi học anh thì được đơn giản hóa, dễ hiểu ạ",
            category: "1-on-1"
        },
        {
            name: "Đỗ Phương Viên",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/do-phuong-vien.png",
            input: { "Listening": "7.5", "Reading": "6.0" },
            output: { "Điểm Overall": "6.5", "Writing": "6.0", "Speaking": "6.5" },
            classInfo: "IELTS 1 ON 1",
            duration: "34h trong 02 tháng",
            quote: "Mình thấy Ngọc dạy khá kỹ và phù hợp với mình, phần Grammar của bản thân mình được cải thiện nhiều rồi nè.",
            category: "1-on-1"
        },

        // LỚP IELTS OFFLINE
        {
            name: "Hoàng Lê Minh Dũng",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-hoang-le-minh-dung.png",
            input: { "Đầu vào": "5.5", "Listening": "9.0", "Reading": "8.0" },
            output: { "Điểm Overall": "8.0", "Writing": "7.0", "Speaking": "7.0" },
            classInfo: "IELTS OFFLINE",
            duration: "48h trong 02 tháng",
            quote: "",
            category: "offline"
        },
        {
            name: "Ngô Nhật Tiến",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/ngo-nhat-tien.png",
            input: { "Đầu vào": "4.0", "Listening": "7.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS OffLINE",
            duration: "384h trong 05 khóa",
            quote: "Xalo như nhà em vậy. Sau 1 thời gian học ở đây em cảm thấy được mọi người yêu thương :3 Đặc biệt là anh Phúc, em gắn bó với anh từ lúc em chưa biết IELTS là gì cho tới lúc em đạt được thành công như bây giờ. Một phần lớn là nhờ anh Phúc hết :3 các giáo viên khác nữa, anh Sơn đã cho em nhiều kiến thức mới, củng cố tinh thần cho em trước khi thi. Chị Ngọc nữa, chị cũng cung cấp cho em nhiều kiến thức, cho em lời khuyên. Chị Ngọc dễ thương ơi là dễ thương, chị luôn cho em sự tự tin mỗi khi em cảm thấy lo lắng về trình độ tiếng anh của mình. Em chưa bao giờ cảm thấy hối tiếc vì học ở Xalo hết.",
            category: "offline"
        },
        {
            name: "Nguyễn Ngọc Khánh Trâm",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/nguyen-ngoc-khanh-tram.png",
            input: { "Đầu vào": "6.5", "Listening": "8.5", "Reading": "8.5" },
            output: { "Điểm Overall": "7.5", "Writing": "7.0", "Speaking": "6.0" },
            classInfo: "IELTS OFFLINE",
            duration: "72h trong 12 tuần",
            quote: "Thầy Minh dạy okie phết, Trâm mới vừa đạt cái thi tuyển đầu vào nhờ mấy tips của thầy á. hehee, mấy tips reading á, tìm từ đồng nghĩa hay đọc đoạn văn òi mới đọc câu hỏi á :))) đó h Trâm toàn làm ngược lại. mng ở Xa Lộ dth với helpful lắm lun",
            category: "offline"
        },
        {
            name: "Trần Tấn Thịnh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/tran-tan-thinh.png",
            input: { "Đầu vào": "5.0", "Listening": "7.5", "Reading": "8.5" },
            output: { "Điểm Overall": "7.0", "Writing": "6.0", "Speaking": "6.5" },
            classInfo: "IELTS OFFLINE",
            duration: "144h trong 06 tháng",
            quote: "Trước khi học tại Xalo thì em khá mơ hồ về kì thi Ielts này, e cảm thấy việc lựa chọn học tại trung tâm là một quyết định đúng đắn của em. Em rất cảm ơn sự nhiệt tình của anh Phúc, anh Sơn đã giúp em nâng cao khả năng của mình lên rất nhiều trong suốt quá trình học ạ. Chúc trung tâm sẽ luôn hoạt động thật năng suất để giúp cho thật nhiều học viên đạt aim nữa nhé!",
            category: "offline"
        },
        {
            name: "Vũ Khánh Như",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/vu-khanh-nhu.png",
            input: { "Đầu vào": "5.5", "Listening": "8.5", "Reading": "8.5" },
            output: { "Điểm Overall": "7.5", "Writing": "7.0", "Speaking": "6.5" },
            classInfo: "IELTS OFFLINE",
            duration: "144h trong 06 tháng",
            quote: "Em thấy giảng viên dạy oke, hông cần phải thay đổi gì nhiều hết ạ",
            category: "offline"
        },
        {
            name: "Đặng Nguyễn Kiều Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/dang-nguyen-kieu-anh.png",
            input: { "Đầu vào": "7.0", "Listening": "8.0", "Reading": "8.5" },
            output: { "Điểm Overall": "7.5", "Writing": "6.0", "Speaking": "6.5" },
            classInfo: "IELTS 1 ON 1 + IELTS OFFLINE",
            duration: "36h trong 36 tuần (Lớp IELTS 1 ON 1) + 72h trong 12 tuần ( LỚP IELTS OFFLINE)",
            quote: "Dạ em thấy trong thời gian học thì được c Uyên và bạn Khoa support rất nhiệt tình, các hand out và bài giảng cũng dễ hiểu và dễ follow. Ngoài ra em cũng được cung cấp thêm nhiều tài liệu tham khảo và cũng có thêm nhiều tips để apply lúc thi ấy ạ.",
            category: "offline"
        },
        {
            name: "Đặng Trần Kim Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/dang-tran-kim-anh.png",
            input: { "Đầu vào": "6.0", "Listening": "8.0", "Reading": "8.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS OFFLINE + LỚP 1 ON 3",
            duration: "72h trong 12 tuần (Lớp IELTS Offline) + 16h trong 01 tháng (Lớp 1 ON 3)",
            quote: "Em rất thích học ở đây, mí anh chị rất dth với lại nhiệt tình, kiểu mấy ac dạy với sửa bài cho bọn em rất có tâm, mỗi lần tới trung tâm là vì thích học lun í. Kiểu ac hiểu rõ điểm mạnh vs điểm yếu của tụi em để giúp em cải thiện, với điểm như vậy thì em khá là hài lòng, em mong sẽ có thể đồng hành cùng ac để đạt tới điểm cao hơn ạ ^^",
            category: "offline"
        },

        // LỚP IELTS ONLINE
        {
            name: "Lê Hà Phương Khánh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-ha-phuong-khanh.png",
            input: { "Đầu vào": "5.5", "Listening": "8.0", "Reading": "7.5" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.5" },
            classInfo: "IELTS ONLINE",
            duration: "60h trong 02 tháng",
            quote: "Em thấy học tại Xa Lộ English rất thoải mái luôn, em học được nhiều lắm ạ. Em đã chỉnh được mấy lỗi ngữ pháp hay sai trước khi và viết câu bớt lộp chộp hơn nè. Còn bài đọc thì khi đọc vô em không còn cảm giác ngán ngẩm như hồi tự làm nữa ạ, chắc là do bị năng lượng của GV lấn át rồi hehe.",
            category: "online"
        },
        {
            name: "Lê Đoàn Đức Mạnh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/le-doan-duc-manh.png",
            input: { "Đầu vào": "7.0", "Listening": "8.5", "Reading": "8.5" },
            output: { "Điểm Overall": "8.0", "Writing": "6.5", "Speaking": "7.5" },
            classInfo: "IELTS ONLINE",
            duration: "48h trong 02 tháng",
            quote: "Em cũng cảm ơn trung tâm rất nhiều vì đã giúp em cải thiện điểm trong phần Đọc và Viết, thật sự những khóa học rất là bổ ích với em, cũng như là anh giảng viên vô cùng dễ thương luôn ❤ Thời gian học khá là linh hoạt để mình có thể tự do chọn lựa với lại mọi người tận tình chỉ dạy em lắm, em xin cảm ơn trung tâm mình nhiều nhiều ❤ ❤",
            category: "online"
        },
        {
            name: "Lý Anh Quân",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/ly-anh-quan.png",
            input: { "Đầu vào": "6.5", "Listening": "8.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS ONLINE",
            duration: "48h trong 02 tháng",
            quote: "Dạ em thấy việc học ở Xa Lộ English đều ổn hết ạ, gv dạy rất nhiều thứ, luôn nhiệt huyết và có tâm ạ.",
            category: "online"
        },
        {
            name: "Ngô Nhật Tiến",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/ngo-nhat-tien.png",
            input: { "Đầu vào": "4.0", "Listening": "7.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.0", "Writing": "6.5", "Speaking": "6.0" },
            classInfo: "IELTS OffLINE",
            duration: "384h trong 05 khóa",
            quote: "Xalo như nhà em vậy. Sau 1 thời gian học ở đây em cảm thấy được mọi người yêu thương :3 Đặc biệt là anh Phúc, em gắn bó với anh từ lúc em chưa biết IELTS là gì cho tới lúc em đạt được thành công như bây giờ. Một phần lớn là nhờ anh Phúc hết :3 các giáo viên khác nữa, anh Sơn đã cho em nhiều kiến thức mới, củng cố tinh thần cho em trước khi thi. Chị Ngọc nữa, chị cũng cung cấp cho em nhiều kiến thức, cho em lời khuyên. Chị Ngọc dễ thương ơi là dễ thương, chị luôn cho em sự tự tin mỗi khi em cảm thấy lo lắng về trình độ tiếng anh của mình. Em chưa bao giờ cảm thấy hối tiếc vì học ở Xalo hết.",
            category: "online"
        },
        {
            name: "Nguyễn Ngọc Za My",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/nguyen-ngoc-za-my.png",
            input: { "Đầu vào": "6.5", "Listening": "8.0", "Reading": "8.5" },
            output: { "Điểm Overall": "7.0", "Writing": "6.0", "Speaking": "6.0" },
            classInfo: "IELTS ONLINE",
            duration: "48h trong 02 tháng",
            quote: "Em cảm thấy nội dung giảng dạy rất sát với đề, kiểu trước khi học thì phần Listening & Reading em chỉ được tầm 20-25 câu đúng thui, cái sau khi học thì em đã nắm được bí kíp, đạt được câu đúng nhiều hơn rồi nè.",
            category: "online"
        },
        {
            name: "Nguyễn Thanh Bảo Ngọc",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-nguyen-thanh-bao-ngoc.png",
            input: { "Đầu vào": "6.0", "Listening": "7.5", "Reading": "8.0" },
            output: { "Điểm Overall": "7.5", "Writing": "6.5", "Speaking": "7.5" },
            classInfo: "IELTS ONLINE",
            duration: "48h trong 02 tháng",
            quote: "Huhu dạ thật sự mà nói là hôm đầu tiên học với anh Phúc em sốc gần chết luôn á chị, em thích mindset với cả cách dạy của anh vô cùng luôn, kiểu bắt kịp với thời đại hiện nay ấy ạ. Thường em học từ vựng không bao giờ vô đầu nhưng mà riêng học với anh Phúc là em học được 20, 30 từ vựng trong 2 tiếng thôi á. Overall là em cực kì cực kì thích tiết của anh. Nhờ anh mà đợt đó em có một cái nhìn khác về IELTS.",
            category: "online"
        },
        {
            name: "Phạm Quỳnh Anh",
            image: "https://xalo.edu.vn/image/catalog/thanh-tich-hoc-vien/-pham-quynh-anh.png",
            input: { "Đầu vào": "6.5", "Listening": "8.5", "Reading": "7.0" },
            output: { "Điểm Overall": "7.5", "Writing": "6.5", "Speaking": "7.0" },
            classInfo: "1 ON 1 + IELTS ONLINE",
            duration: "34h trong 02 tháng (Lớp 1 ON 1) + 48h trong 02 tháng (Lớp IELTS Online)",
            quote: "Lúc đầu em đặt mục tiêu 7.0 thui mà lúc thi được hẳn 7.5 luôn ạaaa",
            category: "online"
        }
    ];

    const filteredAchievements = achievements.filter(item => item.category === activeTab || (activeTab === 'offline' && item.category === 'offline') || (activeTab === 'online' && item.category === 'online'));



    return (
        <div className="pt-20 bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[60vh]"
                style={{
                    backgroundImage: `url(${slider_khac})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-primary-dark opacity-70"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 uppercase tracking-widest drop-shadow-md">Thành Tích Học Viên</h1>
                    <p className="text-center text-white text-lg max-w-3xl mx-auto opacity-90">
                        Bảng vàng thành tích - Minh chứng rõ ràng nhất cho chất lượng đào tạo tại Xa Lộ English.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
            </section>

            {/* Filter Tabs */}
            <Section className="bg-white pb-0 mt-8">
                <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-gray-100 pb-4">
                    {[
                        { id: '1-on-1', label: 'LỚP 1 ON 1' },
                        { id: 'offline', label: 'LỚP IELTS OFFLINE' },
                        { id: 'online', label: 'LỚP IELTS ONLINE' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-6 py-3 font-bold text-lg uppercase tracking-wide transition-all cursor-pointer relative ${activeTab === tab.id
                                ? 'text-primary-dark'
                                : 'text-text-secondary hover:text-primary-dark'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-[-17px] left-0 w-full h-1 bg-primary-dark rounded-t-lg"></span>
                            )}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Achievements Grid */}
            <Section className="bg-gray-50 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAchievements.map((item, index) => (
                        <AchievementCard key={index} {...item} />
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default AchievementsPage;
