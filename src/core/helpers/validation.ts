export function getRules() {
  const rules = {
    firstName: [
      {
        required: true,
        message: "Ad alanı zorunludur",
        trigger: "blur",
      },
    ],
    lastName: [
      {
        required: true,
        message: "Soyad alanı zorunludur",
        trigger: "blur",
      },
    ],
    email: [
      { required: true, message: "E-mail zorunlu", trigger: "blur" },
      {
        type: "email",
        message: "geçerli bir e-posta giriniz",
        trigger: ["blur", "change"],
      },
    ],
    phoneNumber: [
      { required: true, message: "telefon zorunlu", trigger: "blur" },
    ],
    classId: [{ required: true, message: "sınıf seçiniz", trigger: "change" }],

    enrollmentDate: [
      { required: true, message: "Tarhi Zorunludur", trigger: "change" },
    ],
  };
  return { rules }
}

getRules()
