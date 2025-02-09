interface Props {
  totalPrice: number;
  exportParts: () => void;
  importParts: () => void;
  resetParts: () => void;
}

const NavBar = ({
  totalPrice,
  exportParts,
  importParts,
  resetParts,
}: Props) => {
  return (
    <>
      <nav className='navbar fixed-top bg-primary' data-bs-theme='dark'>
        <div className='container-fluid'>
          <div className='d-flex flex-row align-items-center'>
            <div className='navbar-brand'>
              <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
                <img src='/logo.svg' alt='Logo' width='30' height='24' />
                <span className='mx-sm-2'>PC Builder</span>
              </div>
            </div>
            <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center'>
              <div className='mx-sm-6'>
                <span className='text-light'>
                  Total Cost:{' '}
                  <span className='text-body-secondary mx-sm-2'>
                    Tk.{' '}
                    {totalPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  </span>
                </span>
              </div>
              <div className='d-flex flex-row'>
                <button
                  className='btn btn-outline-success mx-sm-1'
                  onClick={exportParts}
                >
                  Export
                </button>
                <button
                  className='btn btn-outline-info mx-sm-1'
                  onClick={importParts}
                >
                  Import
                </button>
                <button
                  className='btn btn-outline-danger mx-sm-1'
                  onClick={resetParts}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
