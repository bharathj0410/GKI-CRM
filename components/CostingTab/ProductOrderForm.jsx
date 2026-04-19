import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Checkbox,
  Chip,
  Form,
  NumberInput,
  Select,
  SelectItem,
} from "@heroui/react";
import ColorPicker from "@/components/ColorPicker";
import { DatePicker } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import PaperType from "@/components/CostingTab/DropDowns/PaperType";
import FluteType from "@/components/CostingTab/DropDowns/FluteType";
import Bf from "@/components/CostingTab/DropDowns/Bf";
import Bs from "@/components/CostingTab/DropDowns/BS";
import Gsm from "@/components/CostingTab/DropDowns/Gsm";
import Cobb from "@/components/CostingTab/DropDowns/Cobb";
import ProductTable from "@/components/CostingTab/ProductTable";
import BSTI from "./Boxs/BSTI/Index";
import BB from "./Boxs/BB/Index";
import CB from "./Boxs/CB/Index";
import UB from "./Boxs/UB/Index";
import TTIBCL from "./Boxs/TTIBCL/Index";
import Plates from "./Boxs/Plates/Index";
import TUBCL from "./Boxs/TUBCL/Index";
import OralInfo from "./Boxs/OralInfo/Index";
import axios from "@/lib/axios";
import Toast from "../Toast";
import { toPng } from "html-to-image";
import {
  now,
  getLocalTimeZone,
  parseDate,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { on } from "events";

let defaultformData = { colorCount: 1 };
export default function ProductOrderForm({
  billId,
  isDisabled,
  formData = defaultformData,
  updateData,
  onClose,
}) {
  const [boxType, setBoxType] = useState([]);
  const [colorType, setColorType] = useState([]);
  const [dimensionInfo, setDimensionInfo] = useState({});
  // const boxType = [
  //   { key: "Universal Box", label: "Universal Box" },
  //   { key: "Top Tuck In Bottom Crush Lock", label: "Top Tuck In Bottom Crush Lock" },
  //   { key: "Both Side Tuck In", label: "Both Side Tuck In" },
  //   { key: "Butterfly Box", label: "Butterfly Box" },
  //   { key: "Cake Box", label: "Cake Box" },
  //   { key: "Plates", label: "Plates" },
  //   { key: "Partition", label: "Partition" },
  //   { key: "Tray", label: "Tray" },
  //   { key: "Top And Bottom Box", label: "Top And Bottom Box" },
  //   { key: "Top Universal Bottom Crush Lock", label: "Top Universal Bottom Crush Lock" },
  //   { key: "others", label: "Others" },
  // ];
  const printingType = [
    { key: "Printed", label: "Printed" },
    { key: "Un Printed", label: "Un Printed" },
  ];
  // const colorType = [
  //   { key: "single_color_stereo", label: "Single Color Stereo" },
  //   { key: "two_color_stereo", label: "Two Color Stereo" },
  //   { key: "three_color_stereo", label: "Three Color Stereo" },
  //   { key: "single_color_offset", label: "Single Color offset" },
  //   { key: "two_color_offset", label: "Two Color Offset" },
  //   { key: "three_color_offset", label: "Three Color Offset" },
  //   { key: "multi_color_offset", label: "Multi Color Offset" },
  // ]
  const FlapType = [
    { key: "Pinning", label: "Pinning" },
    { key: "Pasting", label: "Pasting" },
  ];
  const PiningType = [
    { key: "Single", label: "Single" },
    { key: "Double", label: "Double" },
    { key: "Both", label: "Both" },
  ];

  const ReferenceMaterialType = [
    {
      key: "Drawing",
      label: "Drawing",
    },
    {
      key: "Article Sample (Things)",
      label: "Article Sample (Things)",
    },
    {
      key: "Product Sample (Required Product)",
      label: "Product Sample (Required Product)",
    },
    {
      key: "Oral Information (Details)",
      label: "Oral Information (Details)",
    },
    {
      key: "Identical Sample (Similar to Required Product)",
      label: "Identical Sample (Similar to Required Product)",
    },
  ];

  const PunchingType = [
    { key: "Punching", label: "Punching" },
    { key: "Rotary", label: "Rotary" },
    { key: "Detail Given Type", label: "Detail Given Type" },
  ];

  const GrainType = [
    { key: "Along Grain", label: "Along Grain" },
    { key: "Cross Grain", label: "Cross Grain" },
  ];

  const [data, setData] = useState(formData);
  const [ply, setPly] = useState(data?.ply ? data.ply : 0);
  const [addInfoSelected, setAddInfoSelected] = useState(
    data?.boxInfo ? data.boxInfo : false,
  );

  const [rows, setrows] = useState([]);
  useEffect(() => {
    let row = (ply - 1) / 2;
    let mainData = [];

    Array.from({ length: row }).map((_, index) => {
      if (!data?.[`flute${index + 1}Type`]) {
        handleSelectionChange(`flute${index + 1}Type`, "Flute");
      }
      mainData.push({
        key: `F${index + 1}`,
        layers: `Flute ${index + 1}`,
        paperType: (
          <PaperType
            name={`flute${index + 1}PaperType`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        typeOfFlute: (
          <FluteType
            name={`flute${index + 1}Type`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        bf: (
          <Bf
            name={`flute${index + 1}BF`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        gsm: (
          <Gsm
            name={`flute${index + 1}GSM`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        bs: (
          <Bs
            name={`flute${index + 1}BS`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        cobb: (
          <Cobb
            name={`flute${index + 1}COBB`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
      });
      if (!data?.[`liner${index + 1}Type`]) {
        handleSelectionChange(`liner${index + 1}Type`, "Liner");
      }
      mainData.push({
        key: `L${index + 1}`,
        layers: `Liner ${index + 1}`,
        paperType: (
          <PaperType
            name={`liner${index + 1}PaperType`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        typeOfFlute: (
          <FluteType
            name={`liner${index + 1}Type`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        bf: (
          <Bf
            name={`liner${index + 1}BF`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        gsm: (
          <Gsm
            name={`liner${index + 1}GSM`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        bs: (
          <Bs
            name={`liner${index + 1}BS`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
        cobb: (
          <Cobb
            name={`liner${index + 1}COBB`}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        ),
      });
    });

    row = ply - 1;

    if (!data?.[`topType`]) {
      handleSelectionChange(`topType`, "Liner");
    }
    const topLayer = {
      key: "1",
      layers: "Top",
      paperType: (
        <PaperType
          name={`topPaperType`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      typeOfFlute: (
        <FluteType
          name={`topFluteType`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      bf: (
        <Bf
          name={`topBF`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      gsm: (
        <Gsm
          name={`topGSM`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      bs: (
        <Bs
          name={`topBS`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      cobb: (
        <Cobb
          name={`topCOBB`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
    };
    if (!data?.[`bottomType`]) {
      handleSelectionChange(`bottomType`, "Liner");
    }
    const SecondLayer = {
      key: "2",
      layers: "Bottom",
      paperType: (
        <PaperType
          name={`bottomPaperType`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      typeOfFlute: (
        <FluteType
          name={`bottomType`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      bf: (
        <Bf
          name={`bottomBF`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      gsm: (
        <Gsm
          name={`bottomGSM`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      bs: (
        <Bs
          name={`bottomBS`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
      cobb: (
        <Cobb
          name={`bottomCOBB`}
          data={data}
          handleSelectionChange={handleSelectionChange}
        />
      ),
    };

    if (row >= 2) {
      setrows([topLayer, ...mainData]);
    } else if (row === 1) {
      setrows([topLayer, SecondLayer]);
    } else {
      setrows([topLayer]);
    }
  }, [ply, data]);

  useEffect(() => {
    axios
      .get(`getConfigData?tableName=Box Type&forDropDown=true`)
      .then((data) => {
        const fetchedData = data.data || [];
        setBoxType(fetchedData);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`getConfigData?tableName=Color Type&forDropDown=true`)
      .then((data) => {
        const fetchedData = data.data || [];
        setColorType(fetchedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const imgRef = useRef(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    // const formData = Object.fromEntries(new FormData(e.currentTarget));
    // console.log(formData)
    console.log(data);
    if (data) {
      const productDiagram = await toPng(imgRef.current, { cacheBust: true });
      const response = await axios.post("/addProductDetails", {
        productDiagram: productDiagram,
        parentId: billId,
        ...data,
      });
      if (response.status === 200) {
        Toast("Saved", response.data.message, "success");
        formElement.reset();
        updateData();
        onClose();
        // setBillId(response.data.id)
      } else {
        Toast("Error", response?.data?.error, "danger");
        console.log(response);
      }
    }
  };
  const handleDownload = async () => {
    if (imgRef.current === null) return;

    const product_diagram = await toPng(imgRef.current, { cacheBust: true });

    const link = document.createElement("a");
    link.download = "my-component.png";
    link.href = product_diagram;
    link.click();
  };
  const handleSelectionChange = (fieldName, value) => {
    setData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  return (
    <Form className="w-full p-6 rounded-2xl space-y-6" onSubmit={onSubmit}>
      <div className="flex justify-between w-full items-center">
        <div className="text-2xl font-bold text-gray-800">
          Product & Order Details
        </div>
        <div className="flex items-center">
          <div className="font-bold text-sm pr-2">Guest ID :&nbsp;</div>
          <Chip color="success" variant="dot" size="sm">
            {billId}
          </Chip>
        </div>
      </div>

      {/* Enquiry Section */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Enquiry</h2>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Product Name"
            name="productName"
            type="text"
            color="secondary"
            value={data?.productName}
            onValueChange={(value) =>
              handleSelectionChange("productName", value)
            }
            isRequired
            isDisabled={isDisabled}
          />
          <I18nProvider locale="en-IN">
            <DatePicker
              name="enquiryDate"
              className="w-full"
              color="secondary"
              placeholder="Date of Enquiry"
              label="Date of Enquiry"
              isRequired
              value={
                data?.enquiryDate
                  ? parseDate(data.enquiryDate)
                  : now(getLocalTimeZone())
              }
              onChange={(value) =>
                handleSelectionChange("enquiryDate", value.toString())
              }
            />
          </I18nProvider>
          <I18nProvider locale="en-IN">
            <DatePicker
              name="dispatchDate"
              className="w-full"
              color="secondary"
              value={data?.dispatchDate ? parseDate(data.dispatchDate) : null}
              onChange={(value) =>
                handleSelectionChange("dispatchDate", value.toString())
              }
              placeholder="Date of Enquiry"
              label="Date of Dispatch"
            />
          </I18nProvider>
          <Input
            label="Party Product Code"
            name="partyProductCode"
            type="text"
            color="secondary"
            value={data?.partyProductCode || ""}
            onValueChange={(value) =>
              handleSelectionChange("partyProductCode", value)
            }
          />
          <Input
            label="Unprinted Name"
            name="unprintedName"
            type="text"
            color="secondary"
            value={data?.unprintedName || ""}
            onValueChange={(value) =>
              handleSelectionChange("unprintedName", value)
            }
          />
          <Input
            label="Printed Name"
            name="printedName"
            type="text"
            color="secondary"
            value={data?.printedName || ""}
            onValueChange={(value) =>
              handleSelectionChange("printedName", value)
            }
          />
          <Input
            label="Billing Product Name"
            name="billingProductName"
            type="text"
            color="secondary"
            value={data?.billingProductName || ""}
            onValueChange={(value) =>
              handleSelectionChange("billingProductName", value)
            }
          />
          <NumberInput
            hideStepper
            label="Page No"
            name="pageNo"
            color="secondary"
            value={data?.pageNo || ""}
            onValueChange={(value) => handleSelectionChange("pageNo", value)}
          />
          <Input
            label="Company Code"
            name="companyCode"
            type="text"
            color="secondary"
            value={data?.companyCode || ""}
            onValueChange={(value) =>
              handleSelectionChange("companyCode", value)
            }
          />
          <Textarea
            className="w-full col-span-3"
            label="Type of information given about product"
            placeholder="Enter product information"
            color="secondary"
            name="productInformation"
            value={data?.productInformation ? data.productInformation : ""}
            onChange={(value) =>
              handleSelectionChange("productInformation", value.target.value)
            }
          />
        </div>
      </div>

      {/* General Order Information */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Address Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Textarea
            className="w-full"
            label="Billing Address"
            placeholder="Enter billing address"
            color="secondary"
            name="billingAddress"
            value={data?.billingAddress || ""}
            onValueChange={(value) =>
              handleSelectionChange("billingAddress", value)
            }
          />
          <Textarea
            className="w-full"
            label="Delivery Address"
            placeholder="Enter delivery address"
            color="secondary"
            name="deliveryAddress"
            value={data?.deliveryAddress || ""}
            onValueChange={(value) =>
              handleSelectionChange("deliveryAddress", value)
            }
          />
          <Input
            label="GSTN"
            name="gstn"
            type="text"
            color="secondary"
            value={data?.gstn || ""}
            onValueChange={(value) => handleSelectionChange("gstn", value)}
          />
        </div>
      </div>

      {/* General Order Information */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          General Order Information
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {/* <Input type="date" name="dispatch_date" placeholder="Dispatch Date" color="secondary" /> */}
          <NumberInput
            hideStepper
            className="w-full"
            label="Order Quantity"
            name="orderQuantity"
            color="secondary"
            isRequired
            value={data?.orderQuantity ? data.orderQuantity : ""}
            onValueChange={(value) =>
              handleSelectionChange("orderQuantity", value)
            }
          />
          <NumberInput
            className="max-w-xs"
            defaultValue={0}
            formatOptions={{
              signDisplay: "exceptZero",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
            color="secondary"
            label="Quantity (+ -)"
            name="quantityPlusMinus"
            isRequired
            value={data?.quantityPlusMinus ? data.quantityPlusMinus : ""}
            onValueChange={(value) =>
              handleSelectionChange("quantityPlusMinus", value)
            }
          />
        </div>
      </div>

      {/* General Box Information */}
      <h2 className="text-xl font-semibold mb-2">General Box Information</h2>
      <div className="grid grid-cols-4 gap-4 items-center w-full">
        <Checkbox
          isSelected={data?.boxInfo ? data.boxInfo : addInfoSelected}
          className="py-10"
          name="boxInfo"
          value={data?.boxInfo ? data.boxInfo : addInfoSelected}
          onValueChange={(value) => {
            handleSelectionChange("boxInfo", value);
            setAddInfoSelected(value);
          }}
        >
          Add Box Info
        </Checkbox>
        {addInfoSelected && (
          <div className="col-span-3 grid grid-cols-3 gap-4">
            <NumberInput
              className=""
              name={"boxBS"}
              size="lg"
              hideStepper
              label="Required BS"
              color="secondary"
              value={data?.boxBS ? data.boxBS : ""}
              onValueChange={(value) => handleSelectionChange("boxBS", value)}
            />
            <NumberInput
              className=""
              name={"boxCS"}
              size="lg"
              hideStepper
              label="Required CS"
              color="secondary"
              value={data?.boxCS ? data.boxCS : ""}
              onValueChange={(value) => handleSelectionChange("boxCS", value)}
            />
            <NumberInput
              className=""
              name={"boxGrams"}
              size="lg"
              hideStepper
              label="Grams"
              color="secondary"
              value={data?.boxGrams ? data.boxGrams : ""}
              onValueChange={(value) =>
                handleSelectionChange("boxGrams", value)
              }
            />
            <NumberInput
              className=""
              name={"boxECT"}
              size="lg"
              hideStepper
              label="Required ECT of Box"
              color="secondary"
              value={data?.boxECT || ""}
              onValueChange={(value) => handleSelectionChange("boxECT", value)}
            />
            <NumberInput
              className=""
              name={"boxMoisturePercent"}
              size="lg"
              hideStepper
              label="Moisture % of Box"
              color="secondary"
              value={data?.boxMoisturePercent || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxMoisturePercent", value)
              }
            />
            <NumberInput
              className=""
              name={"boxFlatCS"}
              size="lg"
              hideStepper
              label="Required Flat CS"
              color="secondary"
              value={data?.boxFlatCS || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxFlatCS", value)
              }
            />
            <NumberInput
              className=""
              name={"boxPuncherResistance"}
              size="lg"
              hideStepper
              label="Puncher Resistance"
              color="secondary"
              value={data?.boxPuncherResistance || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxPuncherResistance", value)
              }
            />
            <NumberInput
              className=""
              name={"boxTareResistance"}
              size="lg"
              hideStepper
              label="Tare Resistance"
              color="secondary"
              value={data?.boxTareResistance || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxTareResistance", value)
              }
            />
            <NumberInput
              className=""
              name={"boxTotalDryGum"}
              size="lg"
              hideStepper
              label="Total Dry Gum"
              color="secondary"
              value={data?.boxTotalDryGum || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxTotalDryGum", value)
              }
            />
            <NumberInput
              className=""
              name={"boxStackingLoad"}
              size="lg"
              hideStepper
              label="Required Stacking Load"
              color="secondary"
              value={data?.boxStackingLoad || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxStackingLoad", value)
              }
            />
            <NumberInput
              className=""
              name={"boxesToBeStacked"}
              size="lg"
              hideStepper
              label="No. of Boxes to Stack"
              color="secondary"
              value={data?.boxesToBeStacked || ""}
              onValueChange={(value) =>
                handleSelectionChange("boxesToBeStacked", value)
              }
            />
            <Input
              label="Type of Product"
              name="typeOfProduct"
              type="text"
              color="secondary"
              value={data?.typeOfProduct || ""}
              onValueChange={(value) =>
                handleSelectionChange("typeOfProduct", value)
              }
            />
          </div>
        )}
      </div>

      {/* General Product Information */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">
          General Product Information
        </h2>
        <div className="flex gap-2">
          <Select
            className=""
            label="Details type given at enquiry"
            color="secondary"
            name="detailsTypeGivenAtEnquiry"
            defaultSelectedKeys={[
              data?.detailsTypeGivenAtEnquiry
                ? data.detailsTypeGivenAtEnquiry
                : "",
            ]}
            onChange={(value) =>
              handleSelectionChange(
                "detailsTypeGivenAtEnquiry",
                value.target.value,
              )
            }
          >
            {ReferenceMaterialType.map((data) => (
              <SelectItem key={data.key}>{data.label}</SelectItem>
            ))}
          </Select>

          {data?.detailsTypeGivenAtEnquiry == "Oral Information (Details)" && (
            <Select
              className=""
              label="Detail type"
              color="secondary"
              name="detailType"
              defaultSelectedKeys={[data?.detailType ? data.detailType : ""]}
              onChange={(value) =>
                handleSelectionChange("detailType", value.target.value)
              }
            >
              {[
                {
                  key: "Oral Information",
                  label: "Oral Information",
                },
                {
                  key: "Article Sample (Things)",
                  label: "Article Sample (Things)",
                },
              ].map((data) => (
                <SelectItem key={data.key}>{data.label}</SelectItem>
              ))}
            </Select>
          )}
        </div>
        {data?.detailType == "Oral Information" &&
          data?.detailsTypeGivenAtEnquiry == "Oral Information (Details)" && (
            <OralInfo
              data={data}
              handleSelectionChange={handleSelectionChange}
            />
          )}
        <div className="pt-5">
          <div className="grid grid-cols-4 gap-4 w-full pb-5">
            <Select
              className="w-full col-span-3"
              name="boxType"
              items={boxType}
              label="Type Of Box"
              placeholder="Select A Type Of Box"
              color="secondary"
              defaultSelectedKeys={[data?.boxType ? data.boxType : ""]}
              onChange={(value) =>
                handleSelectionChange("boxType", value.target.value)
              }
              // onSelectionChange={(box) => setSelectedBox(box.currentKey)}
              isRequired
            >
              {(boxType) => <SelectItem>{boxType.label}</SelectItem>}
            </Select>

            <NumberInput
              className="w-full"
              label="No. Of Ply"
              color="secondary"
              name="ply"
              // onValueChange={setPly}
              value={data?.ply ? data.ply : ""}
              onValueChange={(value) => {
                handleSelectionChange("ply", value);
                setPly(value);
              }}
            />
          </div>

          {rows.map((row) => (
            <ProductTable
              row={row}
              key={row.key}
              handleSelectionChange={handleSelectionChange}
              data={data}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-10">
          <Select
            className="w-full"
            items={printingType}
            label="Printed / Un-Printed"
            color="secondary"
            defaultSelectedKeys={[data?.printingType ? data.printingType : ""]}
            onChange={(value) =>
              handleSelectionChange("printingType", value.target.value)
            }
          >
            {(boxType) => <SelectItem>{boxType.label}</SelectItem>}
          </Select>

          {data?.printingType == "Printed" && (
            <Select
              className="w-full"
              name="colorType"
              items={colorType}
              label="Type Of Printing"
              color="secondary"
              defaultSelectedKeys={[
                data?.colorType ? data.colorType : undefined,
              ]}
              onChange={(value) =>
                handleSelectionChange("colorType", value.target.value)
              }
            >
              {(boxType) => <SelectItem>{boxType.label}</SelectItem>}
            </Select>
          )}
          <NumberInput
            className="w-full"
            label="How many colors?"
            min={1}
            max={3}
            value={data?.colorCount ? data.colorCount : 1}
            onValueChange={(value) =>
              handleSelectionChange(
                "colorCount",
                Math.min(Math.max(1, value), 3),
              )
            }
            color="secondary"
          />
          {/* Render color pickers based on colorCount */}
          <div className="flex justify-evenly bg-secondary/20 rounded-lg ">
            {[...Array(data?.colorCount)].map((_, idx) => (
              <ColorPicker
                key={idx}
                name={`color#${idx + 1}`}
                data={data}
                handleSelectionChange={handleSelectionChange}
              />
            ))}
          </div>

          <Select
            className="w-full"
            name="flapJointType"
            items={FlapType}
            label="Flap Joint Type"
            color="secondary"
            defaultSelectedKeys={[
              data?.flapJointType ? data.flapJointType : undefined,
            ]}
            onChange={(value) =>
              handleSelectionChange("flapJointType", value.target.value)
            }
          >
            {(boxType) => <SelectItem>{boxType.label}</SelectItem>}
          </Select>

          {data?.flapJointType == "Pinning" && (
            <Select
              className="w-full"
              name="piningType"
              items={PiningType}
              label="Pinning Type"
              color="secondary"
              defaultSelectedKeys={[
                data?.piningType ? data.piningType : undefined,
              ]}
              onChange={(value) =>
                handleSelectionChange("piningType", value.target.value)
              }
            >
              {(boxType) => <SelectItem>{boxType.label}</SelectItem>}
            </Select>
          )}
          {data?.flapJointType == "Pinning" && (
            <NumberInput
              hideStepper
              className="w-full"
              label="No of Pins used"
              name="noOfPinsUsed"
              color="secondary"
              value={data?.noOfPinsUsed ? data.noOfPinsUsed : undefined}
              onValueChange={(value) => {
                handleSelectionChange("noOfPinsUsed", value);
              }}
            />
          )}

          <NumberInput
            hideStepper
            className="w-full"
            label="Pieces Per Bundle"
            name="piecesPerBundle"
            color="secondary"
            value={data?.piecesPerBundle ? data.piecesPerBundle : undefined}
            onValueChange={(value) => {
              handleSelectionChange("piecesPerBundle", value);
            }}
          />

          <NumberInput
            hideStepper
            className="w-full"
            label="No of Ups"
            name="noOfUps"
            color="secondary"
            value={data?.noOfUps ? data.noOfUps : undefined}
            onValueChange={(value) => {
              handleSelectionChange("noOfUps", value);
            }}
          />

          <Input
            label="Printing Color Description"
            name="printingColorDescription"
            type="text"
            color="secondary"
            value={data?.printingColorDescription || ""}
            onValueChange={(value) =>
              handleSelectionChange("printingColorDescription", value)
            }
          />

          <Select
            className="w-full"
            name="punchingType"
            items={PunchingType}
            label="Punching / Rotary Type"
            color="secondary"
            defaultSelectedKeys={[
              data?.punchingType ? data.punchingType : undefined,
            ]}
            onChange={(value) =>
              handleSelectionChange("punchingType", value.target.value)
            }
          >
            {(item) => <SelectItem>{item.label}</SelectItem>}
          </Select>

          <Textarea
            className="w-full col-span-3"
            label="Type of Packing"
            placeholder="Enter Packing description"
            color="secondary"
            name="packingDescription"
            value={
              data?.packingDescription ? data.packingDescription : undefined
            }
            onValueChange={(value) => {
              handleSelectionChange("packingDescription", value);
            }}
          />
          <Textarea
            className="w-full col-span-3"
            label="Product Description"
            placeholder="Enter description"
            color="secondary"
            name="productDescription"
            value={
              data?.productDescription ? data.productDescription : undefined
            }
            onValueChange={(value) => {
              handleSelectionChange("productDescription", value);
            }}
          />
        </div>
      </div>
      <div></div>

      {/* OD Size (Outer Dimensions) */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">
          OD Size (Outer Dimensions in cm)
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <NumberInput
            hideStepper
            className="w-full"
            label="OD Length (cm)"
            name="odLength"
            color="secondary"
            value={data?.odLength || ""}
            onValueChange={(value) => handleSelectionChange("odLength", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="OD Width (cm)"
            name="odWidth"
            color="secondary"
            value={data?.odWidth || ""}
            onValueChange={(value) => handleSelectionChange("odWidth", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="OD Height (cm)"
            name="odHeight"
            color="secondary"
            value={data?.odHeight || ""}
            onValueChange={(value) => handleSelectionChange("odHeight", value)}
          />
        </div>
      </div>

      {/* Required Quality Details */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Required Quality Details</h2>
        <div className="grid grid-cols-4 gap-4">
          <NumberInput
            hideStepper
            className="w-full"
            label="Flute Length"
            name="fluteLength"
            color="secondary"
            value={data?.fluteLength || ""}
            onValueChange={(value) =>
              handleSelectionChange("fluteLength", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Paper Thickness"
            name="paperThickness"
            color="secondary"
            value={data?.paperThickness || ""}
            onValueChange={(value) =>
              handleSelectionChange("paperThickness", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Moisture %"
            name="moisturePercent"
            color="secondary"
            value={data?.moisturePercent || ""}
            onValueChange={(value) =>
              handleSelectionChange("moisturePercent", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="RCT"
            name="rct"
            color="secondary"
            value={data?.rct || ""}
            onValueChange={(value) => handleSelectionChange("rct", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Tearing Strength"
            name="tearingStrength"
            color="secondary"
            value={data?.tearingStrength || ""}
            onValueChange={(value) =>
              handleSelectionChange("tearingStrength", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="ECT"
            name="ect"
            color="secondary"
            value={data?.ect || ""}
            onValueChange={(value) => handleSelectionChange("ect", value)}
          />
          <Input
            label="ECT Code"
            name="ectCode"
            type="text"
            color="secondary"
            value={data?.ectCode || ""}
            onValueChange={(value) => handleSelectionChange("ectCode", value)}
          />
          <Input
            label="Paper Mill / Brand Name"
            name="paperMillBrandName"
            type="text"
            color="secondary"
            value={data?.paperMillBrandName || ""}
            onValueChange={(value) =>
              handleSelectionChange("paperMillBrandName", value)
            }
          />
          <Select
            className="w-full"
            name="grainType"
            items={GrainType}
            label="Grain Type"
            color="secondary"
            defaultSelectedKeys={[data?.grainType ? data.grainType : undefined]}
            onChange={(value) =>
              handleSelectionChange("grainType", value.target.value)
            }
          >
            {(item) => <SelectItem>{item.label}</SelectItem>}
          </Select>
          <Input
            label="Decal Size (acc. to grains)"
            name="decalSizeGrains"
            type="text"
            color="secondary"
            value={data?.decalSizeGrains || ""}
            onValueChange={(value) =>
              handleSelectionChange("decalSizeGrains", value)
            }
          />
          <Input
            label="Cutting Size (acc. to grains)"
            name="cuttingSizeGrains"
            type="text"
            color="secondary"
            value={data?.cuttingSizeGrains || ""}
            onValueChange={(value) =>
              handleSelectionChange("cuttingSizeGrains", value)
            }
          />
        </div>
      </div>

      {/* Partition & Die Details */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Partition & Die Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Partition Pattern"
            name="partitionPattern"
            type="text"
            color="secondary"
            value={data?.partitionPattern || ""}
            onValueChange={(value) =>
              handleSelectionChange("partitionPattern", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Width Pieces in Partition/Set"
            name="widthPiecesInPartition"
            color="secondary"
            value={data?.widthPiecesInPartition || ""}
            onValueChange={(value) =>
              handleSelectionChange("widthPiecesInPartition", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Length Pieces in Partition/Set"
            name="lengthPiecesInPartition"
            color="secondary"
            value={data?.lengthPiecesInPartition || ""}
            onValueChange={(value) =>
              handleSelectionChange("lengthPiecesInPartition", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Slots in Width Piece"
            name="slotsInWidthPiece"
            color="secondary"
            value={data?.slotsInWidthPiece || ""}
            onValueChange={(value) =>
              handleSelectionChange("slotsInWidthPiece", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Slots in Length Piece"
            name="slotsInLengthPiece"
            color="secondary"
            value={data?.slotsInLengthPiece || ""}
            onValueChange={(value) =>
              handleSelectionChange("slotsInLengthPiece", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Width Pieces on Cutting Die"
            name="widthPiecesOnCuttingDie"
            color="secondary"
            value={data?.widthPiecesOnCuttingDie || ""}
            onValueChange={(value) =>
              handleSelectionChange("widthPiecesOnCuttingDie", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Length Pieces on Cutting Die"
            name="lengthPiecesOnCuttingDie"
            color="secondary"
            value={data?.lengthPiecesOnCuttingDie || ""}
            onValueChange={(value) =>
              handleSelectionChange("lengthPiecesOnCuttingDie", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Width Pieces on Decal Die"
            name="widthPiecesOnDecalDie"
            color="secondary"
            value={data?.widthPiecesOnDecalDie || ""}
            onValueChange={(value) =>
              handleSelectionChange("widthPiecesOnDecalDie", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Length Pieces on Decal Die"
            name="lengthPiecesOnDecalDie"
            color="secondary"
            value={data?.lengthPiecesOnDecalDie || ""}
            onValueChange={(value) =>
              handleSelectionChange("lengthPiecesOnDecalDie", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="No. of Parts/Box"
            name="noOfPartsPerBox"
            color="secondary"
            value={data?.noOfPartsPerBox || ""}
            onValueChange={(value) =>
              handleSelectionChange("noOfPartsPerBox", value)
            }
          />
          <Input
            label="Name of the Set"
            name="nameOfSet"
            type="text"
            color="secondary"
            value={data?.nameOfSet || ""}
            onValueChange={(value) => handleSelectionChange("nameOfSet", value)}
          />
        </div>
      </div>

      {/* Physical Dimensions & Calculations */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Dimensions & Die Details</h2>
        <div className="grid grid-cols-4 gap-4">
          <NumberInput
            hideStepper
            className="w-full"
            label="Decal Length"
            name="decalLength"
            color="secondary"
            value={data?.decalLength || ""}
            onValueChange={(value) =>
              handleSelectionChange("decalLength", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Decal Width"
            name="decalWidth"
            color="secondary"
            value={data?.decalWidth || ""}
            onValueChange={(value) =>
              handleSelectionChange("decalWidth", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Cutting Length"
            name="cuttingLength"
            color="secondary"
            value={data?.cuttingLength || ""}
            onValueChange={(value) =>
              handleSelectionChange("cuttingLength", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Cutting Width"
            name="cuttingWidth"
            color="secondary"
            value={data?.cuttingWidth || ""}
            onValueChange={(value) =>
              handleSelectionChange("cuttingWidth", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Total Ups"
            name="totalUps"
            color="secondary"
            value={data?.totalUps || ""}
            onValueChange={(value) => handleSelectionChange("totalUps", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Sample Box Weight (kg)"
            name="sampleBoxWeight"
            color="secondary"
            value={data?.sampleBoxWeight || ""}
            onValueChange={(value) =>
              handleSelectionChange("sampleBoxWeight", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Die B to B Size"
            name="dieBToB"
            color="secondary"
            value={data?.dieBToB || ""}
            onValueChange={(value) => handleSelectionChange("dieBToB", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Sample Piece Weight (kg)"
            name="samplePieceWeight"
            color="secondary"
            value={data?.samplePieceWeight || ""}
            onValueChange={(value) =>
              handleSelectionChange("samplePieceWeight", value)
            }
          />
          <Input
            label="Board 1 Size"
            name="board1Size"
            type="text"
            color="secondary"
            value={data?.board1Size || ""}
            onValueChange={(value) =>
              handleSelectionChange("board1Size", value)
            }
          />
          <Input
            label="Board 2 Size"
            name="board2Size"
            type="text"
            color="secondary"
            value={data?.board2Size || ""}
            onValueChange={(value) =>
              handleSelectionChange("board2Size", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="B to B for 1 Box"
            name="bToBForOneBox"
            color="secondary"
            value={data?.bToBForOneBox || ""}
            onValueChange={(value) =>
              handleSelectionChange("bToBForOneBox", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="No. of Boards/Box"
            name="noOfBoardsPerBox"
            color="secondary"
            value={data?.noOfBoardsPerBox || ""}
            onValueChange={(value) =>
              handleSelectionChange("noOfBoardsPerBox", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="No. of Box UPS"
            name="noOfBoxUps"
            color="secondary"
            value={data?.noOfBoxUps || ""}
            onValueChange={(value) =>
              handleSelectionChange("noOfBoxUps", value)
            }
          />
          <Input
            label="Decal Matching Size"
            name="decalMatchingSize"
            type="text"
            color="secondary"
            value={data?.decalMatchingSize || ""}
            onValueChange={(value) =>
              handleSelectionChange("decalMatchingSize", value)
            }
          />
          <Input
            label="Sample Piece Size"
            name="samplePieceSize"
            type="text"
            color="secondary"
            value={data?.samplePieceSize || ""}
            onValueChange={(value) =>
              handleSelectionChange("samplePieceSize", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Sample Piece BS"
            name="samplePieceBS"
            color="secondary"
            value={data?.samplePieceBS || ""}
            onValueChange={(value) =>
              handleSelectionChange("samplePieceBS", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Flute Length of Sample (cm)"
            name="fluteLengthSample"
            color="secondary"
            value={data?.fluteLengthSample || ""}
            onValueChange={(value) =>
              handleSelectionChange("fluteLengthSample", value)
            }
          />
        </div>
      </div>

      {/* Process / Production Details */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">
          Process / Production Details
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Textarea
            className="w-full col-span-3"
            label="Process Names (in order)"
            placeholder="e.g. Foam Pad, Velvet Layer, Buffer, Window PVC, Top Board, Bottom Board..."
            color="secondary"
            name="processNames"
            value={data?.processNames || ""}
            onValueChange={(value) =>
              handleSelectionChange("processNames", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Process Output Length"
            name="processOutputLength"
            color="secondary"
            value={data?.processOutputLength || ""}
            onValueChange={(value) =>
              handleSelectionChange("processOutputLength", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Process Output Width"
            name="processOutputWidth"
            color="secondary"
            value={data?.processOutputWidth || ""}
            onValueChange={(value) =>
              handleSelectionChange("processOutputWidth", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Process Output Height"
            name="processOutputHeight"
            color="secondary"
            value={data?.processOutputHeight || ""}
            onValueChange={(value) =>
              handleSelectionChange("processOutputHeight", value)
            }
          />
          <Input
            label="Process Output Size"
            name="processOutputSize"
            type="text"
            color="secondary"
            value={data?.processOutputSize || ""}
            onValueChange={(value) =>
              handleSelectionChange("processOutputSize", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Fixed Production Speed"
            name="fixedProductionSpeed"
            color="secondary"
            value={data?.fixedProductionSpeed || ""}
            onValueChange={(value) =>
              handleSelectionChange("fixedProductionSpeed", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Man Hours Required"
            name="manHoursRequired"
            color="secondary"
            value={data?.manHoursRequired || ""}
            onValueChange={(value) =>
              handleSelectionChange("manHoursRequired", value)
            }
          />
          <Input
            label="Parts Name"
            name="partsName"
            type="text"
            color="secondary"
            value={data?.partsName || ""}
            onValueChange={(value) => handleSelectionChange("partsName", value)}
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Parts No"
            name="partsNo"
            color="secondary"
            value={data?.partsNo || ""}
            onValueChange={(value) => handleSelectionChange("partsNo", value)}
          />
          <Input
            label="Linked Page No"
            name="linkedPageNo"
            type="text"
            color="secondary"
            value={data?.linkedPageNo || ""}
            onValueChange={(value) =>
              handleSelectionChange("linkedPageNo", value)
            }
          />
          <Input
            label="Name of Other Products Required"
            name="otherProductsRequired"
            type="text"
            color="secondary"
            value={data?.otherProductsRequired || ""}
            onValueChange={(value) =>
              handleSelectionChange("otherProductsRequired", value)
            }
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Quantity of Other Products"
            name="otherProductsQuantity"
            color="secondary"
            value={data?.otherProductsQuantity || ""}
            onValueChange={(value) =>
              handleSelectionChange("otherProductsQuantity", value)
            }
          />
        </div>
      </div>

      <div className="w-full">
        {data?.boxType === "Both Side Tuck In" && (
          <BSTI
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Butterfly Box" && (
          <BB
            ref={imgRef}
            handleDownload={handleDownload}
            ply={ply}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Cake Box" && (
          <CB
            ref={imgRef}
            handleDownload={handleDownload}
            dimensionInfo={dimensionInfo}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Universal Box" && (
          <UB ref={imgRef} handleDownload={handleDownload} />
        )}
        {data?.boxType === "Top Tuck In Bottom Crush Lock" && (
          <TTIBCL
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Plates" && (
          <Plates
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Partition" && (
          <Plates
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Tray" && (
          <Plates
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Top And Bottom Box" && (
          <Plates
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
        {data?.boxType === "Top Universal Bottom Crush Lock" && (
          <TUBCL
            ref={imgRef}
            handleDownload={handleDownload}
            data={data}
            handleSelectionChange={handleSelectionChange}
          />
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-6" color="secondary">
        Submit
      </Button>
    </Form>
  );
}
