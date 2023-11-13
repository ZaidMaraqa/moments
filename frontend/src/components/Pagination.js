import React, { useEffect, useState, useCallback } from "react";
import useBodyClass from '../utils/BodyClass'
import "../css/pagination.css"

const PaginationPosts = ({ activePage, pageCount, onChange }) => {
  const [pages, setPages] = useState([]);

  useBodyClass('pagination-body')
  const buildPages = useCallback(() => {
    let start = 1; // Start from 1 to match 1-indexed pages from backend
    let end = pageCount < 5 ? pageCount + 1 : 5; // If pageCount is less than 5, show all pages, otherwise show up to 5
    console.log(pageCount)
  
    // If activePage is greater than 2, and there are more than 4 pages ahead
    if (activePage > 2 && activePage < pageCount - 2) {
      start = activePage - 2; // Show two page numbers before the active page
      end = activePage + 3; // Show two page numbers after the active page
    } else if (activePage >= pageCount - 2) {
      // If activePage is one of the last three pages
      start = pageCount - 4 > 0 ? pageCount - 4 : 1; // Ensure start is not less than 1
      end = pageCount + 1; // Show the last page
    }
  
    const newPages = [];
    for (let i = start; i < end; i++) {
      newPages.push(i); // Push the page number as is
    }
  
    setPages(newPages);
  }, [activePage, pageCount]);
  

  useEffect(() => {
    console.log('Active Page:', activePage);
    console.log('Page Count:', pageCount);
    console.log('Pages Array:', pages);

    buildPages();
  }, [buildPages]);

  const isActive = (page) => (activePage === page ? "active" : "");


  return (
    <div className="pagination-container">
      <div className="pagination-body">
      <ul className="pagination">
        {/* {activePage > 1 && <button onClick={() => onChange(1)}>1</button>} */}
        {activePage > 3 && <span>...</span>}
        {pages.map((page) => (
          <button
            className={isActive(page)}
            onClick={() => onChange(page)}
            key={page}
          >
            {page}
          </button>
        ))}
        {activePage < pageCount - 4 && <span>...</span>}
        {pageCount > 5 && activePage < pageCount - 1 && (
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
