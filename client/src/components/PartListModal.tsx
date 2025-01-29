import { Part } from '../types';

interface Props {
  partsList: Part[][];
  partType: string;
  currentPrice: number;
  show: boolean;
  onClose: () => void;
  onSelect: (newPart: Part) => void;
  onRemove: () => void;
}

const PartListModal = ({
  partsList,
  partType,
  currentPrice,
  show,
  onClose,
  onSelect,
  onRemove,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div className='modal show' style={{ display: 'block' }} id='exampleModal'>
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header d-flex justify-content-between align-items-center'>
            <h5 className='modal-title'>Select {partType.toUpperCase()}</h5>
            <div className='d-flex align-items-center'>
              <button
                type='button'
                className='btn btn-outline-danger mx-2'
                onClick={onRemove}
              >
                Remove Selection
              </button>
              <button
                type='button'
                className='btn-close'
                onClick={onClose}
                aria-label='Close'
              >
                <span aria-hidden='true'></span>
              </button>
            </div>
          </div>
          <div className='modal-body'>
            {partsList
              .sort((a, b) => a[0].name.localeCompare(b[0].name))
              .map((partsListInner, i) => (
                <div key={i} className='d-flex flex-row justify-content-center'>
                  {partsListInner
                    .sort((a, b) => a.price - b.price)
                    .map((part) => {
                      let priceText = (
                        <p className='card-text'>
                          Tk.{' '}
                          {part.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                          {/* for thousands separator */}
                        </p>
                      );
                      if (part.price === -1) {
                        priceText = <p className='card-text'>N/A</p>;
                      }

                      let priceDifferenceBadge = <span></span>;
                      if (currentPrice !== 0 && part.price !== -1) {
                        const priceDifference = part.price - currentPrice;
                        if (priceDifference < 0) {
                          priceDifferenceBadge = (
                            <span className='badge bg-success mx-1'>
                              -{Math.abs(priceDifference / 1000)}k (
                              {Math.round(
                                Math.abs((priceDifference / currentPrice) * 100)
                              )}
                              %)
                            </span>
                          );
                        } else if (priceDifference > 0) {
                          priceDifferenceBadge = (
                            <span className='badge bg-danger mx-1'>
                              +{Math.abs(priceDifference / 1000)}k (
                              {Math.round(
                                Math.abs((priceDifference / currentPrice) * 100)
                              )}
                              %)
                            </span>
                          );
                        } else {
                          priceDifferenceBadge = (
                            <span className='badge bg-light mx-1'>+0</span>
                          );
                        }
                      }
                      return (
                        <div
                          key={part.url}
                          className='card border-primary mb-3 mx-1'
                          style={{ width: '18rem' }}
                        >
                          <div className='card-body'>
                            <h5 className='card-title'>{part.name}</h5>
                            <div className='d-flex flex-row align-items-center'>
                              <div>{priceText}</div>
                              <div>{priceDifferenceBadge}</div>
                            </div>
                            <p className='card-text'>{part.seller}</p>

                            <button
                              className='btn btn-success mx-1 w-100'
                              onClick={() => onSelect(part)}
                            >
                              Select Part
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartListModal;
