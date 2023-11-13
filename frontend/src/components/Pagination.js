import React, { useEffect, useState, useCallback } from "react";
import useBodyClass from '../utils/BodyClass'
import "../css/pagination.css"


const maxPageButtons = 15;

const PaginationPosts = ({ activePage, pageCount, onChange }) => {
  const [pages, setPages] = useState([]);

  useBodyClass('pagination-body')
  const buildPages = useCallback(() => { // You can adjust this number based on how many buttons you want to show
    let start, end;

    if (pageCount <= maxPageButtons) {
      // If total pages are less than or equal to maxPageButtons, show all
      start = 1;
      end = pageCount + 1;
    } else {
      // Calculate start and end range
      if (activePage <= 3) {
        start = 1;
        end = maxPageButtons + 1;
      } else if (activePage + 2 >= pageCount) {
        start = pageCount - (maxPageButtons - 1);
        end = pageCount + 1;
      } else {
        start = activePage - 2;
        end = activePage + 3;
      }
    }

    const newPages = [];
    for (let i = start; i < end; i++) {
      newPages.push(i);
    }

    setPages(newPages);
  }, [activePage, pageCount]);
  

  useEffect(() => {

    buildPages();
  }, [buildPages]);

  const isActive = (page) => (activePage === page ? "active" : "");


  return (
    <div className="pagination-container">
      <div className="pagination-body">
        <ul className="pagination">
          {activePage > 3 && pageCount > maxPageButtons && <span>...</span>}
          {pages.map((page) => (
            <button
              className={isActive(page)}
              onClick={() => onChange(page)}
              key={page}
            >
              {page}
            </button>
          ))}
          {activePage < pageCount - 2 && pageCount > maxPageButtons && <span>...</span>}
          {pageCount > maxPageButtons && activePage < pageCount - 1 && (
            <button
              className={isActive(pageCount)}
              onClick={() => onChange(pageCount)}
            >
              {pageCount}
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PaginationPosts;
