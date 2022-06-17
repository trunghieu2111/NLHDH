import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface ITientrinh {
  id: number;
  tientrinh: string;
  thoigianxuly: number;
  thoidiem: number;
}

export interface ITgCho {
  tientrinh: number;
  thoigiandung: number
}

@Component({
  selector: 'app-hethong',
  templateUrl: './hethong.component.html',
  styleUrls: ['./hethong.component.css']
})

export class HethongComponent implements OnInit {
  soLuongTT = 0;
  dataF: any;
  mauNen: number[] = [];
  Tg: number = 0;
  thoiGianChoTT: number[] = [];
  flagTableDocQuyen = false;
  isVisible = false;
  submitFormDetails: FormGroup;
  tienTrinhs: ITientrinh[] = [];
  pageIndex: number = 1;
  pageSize: number = 5;
  total: number = 0;

  indexOfInvoiceDetailUpdate: number = 0;
  flagCreateorUpdateInvoiceDetail = true; //Create

  //để không bị trùng id khi mà dùng chức năng sửa
  idOfCreateDetail = 0.5;

  constructor(
    private router: Router,
    private modal: NzModalService,
    public fb: FormBuilder,
  ) {
    this.submitFormDetails = this.fb.group({
      tientrinh: [null, [Validators.required]],
      thoigianxuly: [null, [Validators.required]],
      thoidiem: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  showModal(): void {
    this.flagTableDocQuyen = false;
    this.isVisible = true;
  }

  getObject(i: any) {
    // console.log("Dataa:", Object.entries(i));
    return Object.entries(i);
  }

  handleOk(): void {
    if (isNaN(this.submitFormDetails.get('thoigianxuly')?.value) || isNaN(this.submitFormDetails.get('thoidiem')?.value)) {
      this.modal.error({
        nzTitle: 'Lỗi',
        nzContent: 'Sai định dạng dữ liệu. Vui lòng nhập chữ số vào ô Thời gian xử lý và Thời điểm'
      });
    }
    else {
      if (this.tienTrinhs.find(x => x.tientrinh == this.submitFormDetails.get('tientrinh')?.value) && this.flagCreateorUpdateInvoiceDetail == true) {
        this.modal.error({
          nzTitle: 'Lỗi',
          nzContent: 'Đã tồn tại tiến trình.'
        });
      }

      else {
        const validDetail = this.submitFormDetails.valid;
        if (validDetail) {
          if (this.flagCreateorUpdateInvoiceDetail == true) {
            const par = {
              id: this.idOfCreateDetail + 1,
              tientrinh: this.submitFormDetails.get('tientrinh')?.value,
              thoigianxuly: this.submitFormDetails.get('thoigianxuly')?.value,
              thoidiem: this.submitFormDetails.get('thoidiem')?.value,
            }
            this.tienTrinhs.push(par);
            this.tienTrinhs = [...this.tienTrinhs];

            this.idOfCreateDetail = par.id;
          }
          else {
            for (let i = 0; i < this.tienTrinhs.length; i++) {
              if (this.tienTrinhs[i].id == this.tienTrinhs[this.indexOfInvoiceDetailUpdate].id) {
                const par = {
                  id: this.tienTrinhs[i].id,
                  tientrinh: this.submitFormDetails.get('tientrinh')?.value,
                  thoigianxuly: this.submitFormDetails.get('thoigianxuly')?.value,
                  thoidiem: this.submitFormDetails.get('thoidiem')?.value,
                }
                this.tienTrinhs[i] = par;
                this.tienTrinhs = [...this.tienTrinhs];
                break;
              }
            }
            this.flagCreateorUpdateInvoiceDetail = true;
          }
          this.submitFormDetails.reset();
          this.isVisible = false;
        }
        else {
          for (const i in this.submitFormDetails.controls) {
            if (this.submitFormDetails.controls.hasOwnProperty(i)) {
              this.submitFormDetails.controls[i].markAsDirty();
              this.submitFormDetails.controls[i].updateValueAndValidity();
            }
          }
        }
      }
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.submitFormDetails.reset();
  }

  removeTienTrinh(id: any) {
    this.flagTableDocQuyen = false;
    for (let i of this.tienTrinhs) {
      if (i.id == id) {
        this.tienTrinhs = this.tienTrinhs.filter(item => item != i);
        this.tienTrinhs = [...this.tienTrinhs];
        break;
      }
    }
  }

  editTienTrinh(id: any) {
    this.flagTableDocQuyen = false;
    this.flagCreateorUpdateInvoiceDetail = false;
    for (let i = 0; i < this.tienTrinhs.length; i++) {
      if (this.tienTrinhs[i].id == id) {
        this.submitFormDetails.patchValue({
          tientrinh: this.tienTrinhs[i].tientrinh,
          thoigianxuly: this.tienTrinhs[i].thoigianxuly,
          thoidiem: this.tienTrinhs[i].thoidiem,
        })
        this.indexOfInvoiceDetailUpdate = i;
        break;
      }
    }
    this.showModal();
  }

  onSubmitSJF() {
    this.mauNen = [];
    this.Tg = 0;
    this.thoiGianChoTT = [];
    // this.tienTrinhs = [
    //   {
    //     "id": 1.5,
    //     "tientrinh": "P1",
    //     "thoigianxuly": 4,
    //     "thoidiem": 0
    //   },
    //   {
    //     "id": 2.5,
    //     "tientrinh": "P2",
    //     "thoigianxuly": 3,
    //     "thoidiem": 6
    //   },
    //   {
    //     "id": 3.5,
    //     "tientrinh": "P3",
    //     "thoigianxuly": 6,
    //     "thoidiem": 4
    //   },
    //   {
    //     "id": 4.5,
    //     "tientrinh": "P4",
    //     "thoigianxuly": 8,
    //     "thoidiem": 3
    //   }
    // ];

    this.flagTableDocQuyen = true;
    this.soLuongTT = this.tienTrinhs.length;
    let ans = [];
    for (let i = 0; i < this.tienTrinhs.length; i++) {
      this.tienTrinhs[i].thoidiem = Number(this.tienTrinhs[i].thoidiem);
      this.tienTrinhs[i].thoigianxuly = Number(this.tienTrinhs[i].thoigianxuly);
    }

    //sắp xếp tăng dần đầu vào
    //this.tienTrinhs.sort((a, b) => (a.thoidiem > b.thoidiem) ? 1 : -1)
    let a: number[] = [];// mảng thời gian vào
    let b: number[] = [];// mảng thời gian xử lý
    let sum: number = 0;// tổng thời gian xử lý
    let thoiGianCho: ITgCho[] = [];
    let temp = null;// thời gian xử lý của Thời điểm được chọn
    let count = 0;
    let pos = -1;// Vị trí của tiến trình được chọn
    this.tienTrinhs.forEach(element => {
      a.push(element.thoidiem);
      b.push(element.thoigianxuly);
      sum += element.thoigianxuly;
    });
    let i = Math.min.apply(Math, a);//thời điểm vào đầu tiên

    while (count <= a.length) {
      // debugger
      let c = [];
      if (pos !== -1) {
        c[pos + 1] = 0;
        const para = {
          tientrinh: pos,
          thoigiandung: i
        }
        thoiGianCho.push(para);
        a[pos] = sum + 1;
        pos = -1;
        temp = null;
      }
      c[0] = i;
      for (let j = 0; j < b.length; j++) {
        if (a[j] <= i) {
          a[j] = i;
          c[j + 1] = b[j];
          if (temp == null || b[j] < temp) {
            temp = b[j];
            pos = j;
          }
        } else {
          if (ans.length > 0 && ans[ans.length - 1][j + 1] === 0) c[j + 1] = '';
          if (c[j + 1] !== 0) c[j + 1] = '';
        }
      }
      ans.push(c);
      this.mauNen.push(pos + 1);
      i = i + (temp == null ? 0 : temp);
      count++;
    }
    this.mauNen.pop();
    // console.log("màu:", this.mauNen);
    thoiGianCho.sort((a, b) => (a.tientrinh > b.tientrinh) ? 1 : -1);
    thoiGianCho.forEach(item => {
      const tinhTg = item.thoigiandung - this.tienTrinhs[item.tientrinh].thoidiem - this.tienTrinhs[item.tientrinh].thoigianxuly;
      this.thoiGianChoTT.push(tinhTg);
    });
    this.dataF = ans;
    // console.log("tgcho:", this.thoiGianChoTT);
    let tong = 0;
    this.thoiGianChoTT.forEach(e => {
      tong += e;
    });
    this.Tg = tong / (this.soLuongTT);
  }

  onSubmitSFFKhongDocQuyen() {
    this.mauNen = [];
    this.Tg = 0;
    this.thoiGianChoTT = [];
    // this.tienTrinhs = [
    //   {
    //     "id": 1.5,
    //     "tientrinh": "P1",
    //     "thoigianxuly": 7,
    //     "thoidiem": 0
    //   },
    //   {
    //     "id": 2.5,
    //     "tientrinh": "P2",
    //     "thoigianxuly": 4,
    //     "thoidiem": 2
    //   },
    //   {
    //     "id": 3.5,
    //     "tientrinh": "P3",
    //     "thoigianxuly": 3,
    //     "thoidiem": 4
    //   },
    //   {
    //     "id": 4.5,
    //     "tientrinh": "P4",
    //     "thoigianxuly": 2,
    //     "thoidiem": 7
    //   },
    //   {
    //     "id": 5.5,
    //     "tientrinh": "P5",
    //     "thoigianxuly": 1,
    //     "thoidiem": 9
    //   }
    // ];

    this.flagTableDocQuyen = true;
    this.soLuongTT = this.tienTrinhs.length;
    let ans = [];
    for (let i = 0; i < this.tienTrinhs.length; i++) {
      this.tienTrinhs[i].thoidiem = Number(this.tienTrinhs[i].thoidiem);
      this.tienTrinhs[i].thoigianxuly = Number(this.tienTrinhs[i].thoigianxuly);
    }

    //sắp xếp tăng dần đầu vào
    //this.tienTrinhs.sort((a, b) => (a.thoidiem > b.thoidiem) ? 1 : -1)
    let a: number[] = [];// mảng thời gian vào
    let b: number[] = [];// mảng thời gian xử lý
    let thoiGianCho: ITgCho[] = [];
    let temp = null; //thời gian xử lý của Thời điểm được chọn
    let vao = 0; // cờ của lần đầu so với các lần sau.
    let pos = -1;// Vị trí của tiến trình được chọn (reset)
    let truocPos = -1;// Vị trí của tiến trình được chọn (không reset để tính thời gian chờ).
    this.tienTrinhs.forEach(element => {
      a.push(element.thoidiem);
      b.push(element.thoigianxuly);
    });
    let a1: number[] = [];// mảng thời gian vào sau khi thực hiện 1 tiến trình sẽ trừ đi ptu thời gian vào vừa thực hiện.
    let i = Math.min.apply(Math, a);// thời điểm
    let truocI = -1; // thời điểm -1 của thời điểm.
    let batDauHetTĐ = 0;
    let lonNhatThoiDiem = Math.max.apply(Math, a);
    let dungLap = false;

    while (!dungLap) {
      let c = [];
      if (vao == 1) {
        c[pos + 1] = (temp == null ? 0 : temp) - (i - truocI);
        b[pos] = c[pos + 1];
      }

      if (batDauHetTĐ == 1) {
        c[pos + 1] = 0;
        b[pos] = 0;
      }
      //reset pos với temp
      truocPos = pos;
      pos = -1;
      temp = null;
      c[0] = i;
      for (let j = 0; j < b.length; j++) {
        //Nếu là tt bị trừ đi thì sẽ không vào nữa. (T2)
        if (a[j] <= i && b[j] != -1) {
          c[j + 1] = b[j];
          //qđ lấy tt nào.
          if (b[j] == 0) {
            //Tính thời gian chờ
            const para = {
              tientrinh: truocPos,
              thoigiandung: i
            }
            thoiGianCho.push(para);

            b[j] = -1;
          }
          if (temp == null || b[j] < temp) {
            if (b[j] != -1) {
              temp = b[j];
              pos = j;
            }
          }
        }
        else {
          c[j + 1] = '';
        }
      }



      if (a1.length != 0) {
        a1 = a1.filter(x => x != i);
      }
      else {
        a1 = a.filter(x => x != i);
      }

      let i1 = Math.min.apply(Math, a1);
      if (i < lonNhatThoiDiem) {
        if ((i1 - i) > (temp == null ? 0 : temp)) {
          truocI = i;
          i = i + (temp == null ? 0 : temp);
          vao = 1;
        }
        else {
          truocI = i;
          i = i1;
          vao = 1;
        }
      }
      else {
        i = i + (temp == null ? 0 : temp);
        batDauHetTĐ = 1;
      }

      ans.push(c);
      this.mauNen.push(pos + 1);
      // console.log("dataatesst:", ans);
      // console.log("aaaa:", i1 + "i:" + i + "temp:" + temp);
      // console.log("a1:", a1);
      for (let i = 0; i < b.length; i++) {
        if (b[i] == -1) {
          dungLap = true;
        }
        else {
          dungLap = false;
          break
        }
      }
      // console.log("b:", b)
      // console.log("dung:", dungLap);
    }
    this.dataF = ans;

    this.mauNen.pop();
    
    thoiGianCho.sort((a, b) => (a.tientrinh > b.tientrinh) ? 1 : -1);
    thoiGianCho.forEach(item => {
      const tinhTg = item.thoigiandung - this.tienTrinhs[item.tientrinh].thoidiem - this.tienTrinhs[item.tientrinh].thoigianxuly;
      this.thoiGianChoTT.push(tinhTg);
    });

    let tong = 0;
    this.thoiGianChoTT.forEach(e => {
      tong += e;
    });
    this.Tg = tong / (this.soLuongTT);
  }

  back() {
    this.tienTrinhs = [];
    this.flagTableDocQuyen = false;
  }
}
