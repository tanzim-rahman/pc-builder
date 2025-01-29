import { Part } from '../types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PartListModal from './PartListModal';

interface Props {
  part: Part;
  setPart: (newPart: Part) => void;
}

const PartCard = ({ part, setPart }: Props) => {
  const [partsList, setPartsList] = useState<Part[][]>([]);
  const [showModal, setShowModal] = useState(false);

  const parsePrice = async (
    url: string,
    priceClassSelector: string,
    priceClassSelectorAlt: string,
    priceSymbol: string
  ): Promise<number> => {
    let urlComplete = `http://localhost:5000/fetchPrice?url=${encodeURIComponent(
      url
    )}&priceClassSelector=${priceClassSelector}`;
    if (priceClassSelectorAlt) {
      urlComplete += `&priceClassSelectorAlt=${priceClassSelectorAlt}`;
    }
    if (priceSymbol) {
      urlComplete += `&priceSymbol=${priceSymbol}`;
    }

    const response = await axios(urlComplete);

    let priceFloat = '-1';

    if (response.data.hasPrice) {
      priceFloat = response.data.price;
    }

    return parseFloat(priceFloat);
  };

  useEffect(() => {
    const fetchPrice = async (partType: string) => {
      const partsListOuter: Part[][] = [];

      let partTypeUrl = partType;
      if (partType === 'ram1' || partType === 'ram2') {
        partTypeUrl = 'ram';
      }

      const response = await fetch(`./${partTypeUrl}Urls.csv`);
      const responseText = await response.text();
      const lines = responseText.split('\n');
      const sellers = lines[0].split(',');
      const parts = lines.slice(1);

      parts.map(async (part) => {
        const partsListInner: Part[] = [];
        const choices = part.split(',');
        for (let i = 1; i < choices.length; i++) {
          if (choices[i] == '') {
            continue;
          }

          const newPart: Part = {
            component: partType,
            name: choices[0],
            price: 0,
            seller: sellers[i],
            url: choices[i],
          };

          let price: number = 0;
          switch (newPart.seller) {
            case 'Techland': {
              price = await parsePrice(
                newPart.url,
                '.product-price-new',
                '.product-price',
                '৳'
              );
              break;
            }
            case 'Startech': {
              price = await parsePrice(newPart.url, '.product-price', '', '৳');
              break;
            }
            case 'Ultratech': {
              price = await parsePrice(
                newPart.url,
                '.product-price-new',
                '.product-price',
                '৳'
              );
              break;
            }
          }

          if (price !== -1 && price !== 0) {
            newPart.price = price;

            partsListInner.push(newPart);
          }
        }

        if (partsListInner.length > 0) {
          partsListOuter.push(partsListInner);
        }
      });

      setPartsList(partsListOuter);
    };

    setPart(part);
    fetchPrice(part.component);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = () => {
    if (partsList.length == 0) {
      return;
    }
    return setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChangePart = (newPart: Part) => {
    setPart(newPart);
    closeModal();
  };

  const removePart = () => {
    setPart({
      component: part.component,
      name: 'Not Set',
      price: 0,
      seller: 'Not Set',
      url: '',
    });
    closeModal();
  };

  return (
    <div className='card border-primary mb-3 mx-1' style={{ width: '18rem' }}>
      <div className='card-header'>{part.component.toUpperCase()}</div>
      <div className='card-body'>
        <h5 className='card-title'>{part.name}</h5>
        {part.price === -1 ? (
          <p className='card-text'>N/A</p>
        ) : (
          <p className='card-text'>
            Tk. {part.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            {/* for thousands separator */}
          </p>
        )}

        <p className='card-text'>{part.seller}</p>

        <button className='btn btn-success mx-1' onClick={openModal}>
          Change Part
        </button>

        {part.url && (
          <a href={part.url} className='btn btn-primary mx-1' target='_blank'>
            Visit Website
          </a>
        )}
      </div>

      <PartListModal
        partsList={partsList}
        partType={part.component}
        currentPrice={part.price}
        show={showModal}
        onClose={closeModal}
        onSelect={(newPart: Part) => handleChangePart(newPart)}
        onRemove={removePart}
      />
    </div>
  );
};

export default PartCard;
