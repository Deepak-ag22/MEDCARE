"use client";

import { ChangeEvent, useState, useEffect, useMemo } from "react";
import CardComp from "../Card/Card";
import Search from "../Search-Bar/Search";
import styles from "./Cards.module.css";

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience: string;
    rating: number;
    image: string;
}

interface DoctorsResponse {
    ok: boolean;
    data: {
        rows: Doctor[];
        total: number;
    };
    message?: string;
}

interface Filters {
    rating: string;
    experience: string;
    gender: string;
}

export default function Cards() {
    const [filters, setFilters] = useState<Filters>({
        rating: "any",
        experience: "any",
        gender: "any",
    });

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [searchApplied, setSearchApplied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isResetting, setIsResetting] = useState(false);
    const itemsPerPage = 6;

    const experienceToIntMap: Record<string, number> = {
        "15+": 15,
        "10-15": 10,
        "5-10": 5,
        "3-5": 3,
        "1-3": 1,
        "0-1": 0,
    };

    const filterOptions = useMemo(() => ({
        rating: ["any", "1", "2", "3", "4", "5"],
        experience: ["any", "15+", "10-15", "5-10", "3-5", "1-3", "0-1"],
        gender: ["any", "male", "female"],
    }), []);

    const renderFilterOptions = (name: keyof Filters) => (
        filterOptions[name].map(value => (
            <label className={styles.filterOption} key={value}>
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={filters[name] === value}
                    onChange={handleFilterChange}
                />
                <span>{value === "any" ? "Show All" : value}</span>
            </label>
        ))
    );

    useEffect(() => {
        if (!isResetting) {
            if (searchApplied) {
                handleSearch(searchQuery);
            } else if (filtersApplied) {
                handleFilters();
            } else {
                fetchDoctors();
            }
        }
    }, [currentPage, isResetting, filtersApplied, searchApplied, searchQuery]);

    const handleFilters = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();

            if (filters.rating !== "any") {
                queryParams.append("rating", filters.rating);
            }

            if (filters.experience !== "any") {
                const expValue = experienceToIntMap[filters.experience];
                queryParams.append("experience", expValue.toString());
            }

            if (filters.gender !== "any") {
                queryParams.append("gender", filters.gender);
            }

            if (queryParams.toString()) {
                setFiltersApplied(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/filter?${queryParams.toString()}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pageNum: currentPage }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                            `HTTP error! status: ${response.status}`
                    );
                }

                const data: DoctorsResponse = await response.json();

                if (!data.ok) {
                    throw new Error(
                        data.message || "Failed to fetch filtered doctors"
                    );
                }

                if (!data.data?.rows) {
                    throw new Error("Invalid data format received from server");
                }

                setDoctors(data.data.rows);
                setTotalDoctors(data.data.total || 0);
            } else {
                await fetchDoctors();
            }
        } catch (err) {
            console.error("Error fetching filtered doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while filtering doctors"
            );
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);
            const pageNum = Math.max(1, currentPage);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pageNum }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DoctorsResponse = await response.json();

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch doctors");
            }

            if (!data.data?.rows) {
                throw new Error("Invalid data format received from server");
            }

            setDoctors(data.data.rows);
            setTotalDoctors(data.data.total || 0);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching doctors"
            );
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = async () => {
        if (!filtersApplied) return;

        setIsResetting(true);
        setFilters({
            rating: "any",
            experience: "any",
            gender: "any",
        });
        setCurrentPage(1);
        setFiltersApplied(false);
        setSearchApplied(false);
        setSearchQuery("");
        try {
            setLoading(true);
            setError(null);
            await fetchDoctors();
        } catch (err) {
            console.error("Error fetching doctors after reset:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching doctors"
            );
        } finally {
            setLoading(false);
            setIsResetting(false);
        }
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = async (searchVal: string) => {
        if (!searchVal) return;

        try {
            setLoading(true);
            setError(null);
            setSearchQuery(searchVal);

            const queryParams = new URLSearchParams();
            queryParams.append("q", searchVal);
            queryParams.append("page", currentPage.toString());

            setFiltersApplied(false);
            setSearchApplied(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/search?${queryParams.toString()}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DoctorsResponse = await response.json();

            if (!data.ok) {
                throw new Error(data.message || "Failed to search doctors");
            }

            if (!data.data?.rows) {
                throw new Error("Invalid data format received from server");
            }

            setDoctors(data.data.rows);
            setTotalDoctors(data.data.total || 0);
            setCurrentPage(1);
        } catch (err) {
            console.error("Error searching doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while searching doctors"
            );
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading doctors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <button onClick={fetchDoctors} className={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    const totalPages = Math.max(1, Math.ceil(totalDoctors / itemsPerPage));

    return (
        <div className={styles.pageContainer}>
            <Search handleSearch={handleSearch} />
            <div className={styles.infoText}>
                <p className={styles.docCount}>
                    {totalDoctors} doctors available
                </p>
                <p className={styles.subText}>
                    Book appointments with minimum wait-time & verified doctor
                    details
                </p>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.filtersContainer}>
                    <div className={styles.filterHeader}>
                        <p>Filter By:</p>
                        <button
                            onClick={resetFilters}
                            className={styles.resetButton}
                        >
                            Reset
                        </button>
                    </div>

                    {["rating", "experience", "gender"].map(type => (
                        <div className={styles.filterSection} key={type}>
                            <h4 className={styles.filterTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                            <div className={styles.filterOptions}>
                                {renderFilterOptions(type as keyof Filters)}
                            </div>
                        </div>
                    ))}

                    <button onClick={handleFilters} className={styles.applyBtn}>
                        Apply Filters
                    </button>
                </div>

                <div className={styles.gridContainer}>
                    <div className={styles.cardsGrid}>
                        {doctors.map((doctor) => (
                            <CardComp
                                key={doctor.id}
                                doctor={{
                                    ...doctor,
                                    image: doctor.image,
                                    degree: doctor.specialty,
                                }}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`${styles.paginationButton} ${
                                        currentPage === pageNum
                                            ? styles.activePage
                                            : ""
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}