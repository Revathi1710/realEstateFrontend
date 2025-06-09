import { useEffect, useState } from 'react';
import ReadyToMove from '../icons/readyApartment.avif';
import UnderConstruction from '../icons/underConstruction.avif';

function MoveInProperty() {
  const [readyToMoveCount, setReadyToMoveCount] = useState(0);
  const [underConstructionCount, setUnderConstructionCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getReadyToMoveHome`)
      .then(res => res.json())
      .then(data => setReadyToMoveCount(data.count || 0))
      .catch(err => console.error('Error fetching ready-to-move count:', err));

    fetch(`${process.env.REACT_APP_API_URL}/getUnderConstructionHome`)
      .then(res => res.json())
      .then(data => setUnderConstructionCount(data.count || 0))
      .catch(err => console.error('Error fetching under-construction count:', err));
  }, []);

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-6 col-sm-6 mb-3 pe-lg-3 inner-MoveIn-container">
          <div className="content-readytomove-container">
            <h4 className="fw-bold">Ready to Move</h4>
            <p>{readyToMoveCount}+ properties</p>
          </div>
          <div className="image-readytomove-container">
            <img src={ReadyToMove} alt="Ready to Move" className="rounded" height={200} />
          </div>
        </div>

        <div className="col-lg-6 col-sm-6 mb-3 ps-lg-3 inner-MoveIn-container2">
          <div className="content-readytomove-container">
            <h4 className="fw-bold">Under Construction</h4>
            <p>{underConstructionCount}+ properties</p>
          </div>
          <div className="image-readytomove-container">
            <img src={UnderConstruction} alt="Under Construction" className="rounded" height={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoveInProperty;
