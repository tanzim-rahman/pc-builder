import { useState } from 'react';
import { Part } from './types';
import PartCard from './components/PartCard';
import NavBar from './components/NavBar';

const BuildPage = () => {
  const defaultPart: Part = {
    component: '',
    name: 'Not Set',
    price: 0,
    seller: 'Not Set',
    url: '',
  };

  const getDefaultPart = (partType: string) => {
    const newDefaultPart: Part = { ...defaultPart, component: partType };
    return newDefaultPart;
  };

  interface PartStateType {
    [component: string]: Part;
  }

  const partNames: string[] = [
    'cpu',
    'gpu',
    'motherboard',
    'ram1',
    'ram2',
    'ssd',
    'hdd',
    'pcu',
    'case',
    'cpuCooler',
    'caseFan',
  ];

  const getInitialStates = () => {
    const initialStates: PartStateType = {};
    partNames.map((partName) => {
      initialStates[partName] = getDefaultPart(partName);
    });
    return initialStates;
  };

  const [partStates, setPartStates] = useState<PartStateType>(
    getInitialStates()
  );

  const [totalPrice, setTotalPrice] = useState(0);

  const parseCsv = (data: string): string[] => {
    const lines = data.split('\n');
    const rows = lines.slice(1);
    return rows;
  };

  const parseParts = (rows: string[]) => {
    const newPartStates = { ...partStates };

    rows.map((row) => {
      const fields = row.split(',');
      const newPart: Part = {
        component: fields[0],
        name: fields[1],
        price: Number(fields[2]),
        seller: fields[3],
        url: fields[4],
      };

      if (typeof newPartStates[fields[0]] !== 'undefined') {
        newPartStates[fields[0]] = newPart;
      }
    });

    setPartStates(newPartStates);
    calculateTotalPrice(newPartStates);
  };

  const exportParts = () => {
    const header = ['component', 'name', 'price', 'seller', 'url'];

    const content: string[][] = [];

    partNames.map((partName) =>
      content.push([
        partStates[partName].component,
        partStates[partName].name,
        partStates[partName].price.toString(),
        partStates[partName].seller,
        partStates[partName].url,
      ])
    );

    const rows = [header, ...content];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'my_parts.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const importParts = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files![0];

      // setting up the reader
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = (readerEvent) => {
        const content: string = readerEvent.target!.result!.toString(); // this is the content!
        const csv = parseCsv(content);
        parseParts(csv);
      };
    };

    input.click();
  };

  const resetParts = () => {
    if (confirm('Are you sure you want to reset all parts?')) {
      setPartStates(getInitialStates());
      setTotalPrice(0);
    }
  };

  const calculateTotalPrice = (newPartStates: PartStateType) => {
    let newTotal = 0;

    partNames.map((partName) => {
      if (newPartStates[partName].price !== -1) {
        newTotal += newPartStates[partName].price;
      }
    });

    setTotalPrice(newTotal);
  };

  return (
    <>
      <NavBar
        totalPrice={totalPrice}
        exportParts={exportParts}
        importParts={importParts}
        resetParts={resetParts}
      />

      <div className='container'>
        <div className='grid'>
          <div className='row row-cols-auto row-cols-lg-3'>
            {partNames.map((partName) => (
              <div key={partName} className='col'>
                <PartCard
                  part={partStates[partName]}
                  setPart={(newPart) => {
                    setPartStates((prevState) => {
                      prevState[partName] = newPart;
                      calculateTotalPrice(prevState);
                      return prevState;
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuildPage;
