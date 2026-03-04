import OverviewCard from "./overview-card";

const mockData = [
  {
    title: "ການໃຊ້ຈ່າຍຂອງເດືອນນີ້",
    value: "12450",
    footerDescription: "+8% ຈາກເດືອນທີ່ຜ່ານມາ",
  },
  {
    title: "ຈຳນວນໃບບິນທັ້ງຫມົດ",
    value: "23",
    footerDescription: "ກຸມພາ 2026",
  },
  {
    title: "ການໃຊ້ຈ່າຍໂດຍສະເລ່ຍ",
    value: "415",
    footerDescription: "ຄຳນວນຈາກ 30 ວັນທີ່ຜ່ານມາ",
  },
  {
    title: "ຫມວດຫມູ່ທີ່ໃຊ້ຈ່າຍຫຼາຍທີ່ສຸດ",
    value: "ອາຫານ ແລະ ເຄື່ອງດືມ",
    footerDescription: "45% ຂອງຄ່າໃຊ້ຈ່າຍທັງຫມົດ",
  },
];

export default function OverviewCardContainer() {
  return (
    <div className="*:data-[slot=card]:from-primary/2 *:data-[slot=card]:gap-3 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {mockData.map((data) => (
        <OverviewCard
          key={data.title}
          title={data.title}
          value={data.value}
          footerDescription={data.footerDescription}
        />
      ))}
    </div>
  );
}
