import { afterEach, describe, expect, it, mock } from 'bun:test';

import { createMockAnalysisResult } from '@git-repo-analyzer/mocks';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { AnalysisReportCard } from './AnalysisReportCard';

describe('AnalysisReportCard', () => {
  afterEach(() => {
    cleanup();
  });

  const mockReport = createMockAnalysisResult();
  const defaultProps = {
    report: mockReport,
    onClick: mock(() => {}),
    onDelete: mock(() => {}),
  };

  it('renders the repo name', () => {
    render(<AnalysisReportCard {...defaultProps} />);

    expect(screen.getByText(mockReport.basicStats.fullName)).toBeDefined();
  });

  it('renders the health score badge', () => {
    render(<AnalysisReportCard {...defaultProps} />);

    const percentage = `${Math.round(mockReport.healthScore.overall)}%`;
    expect(screen.getByText(percentage)).toBeDefined();
  });

  it('renders tech stack tools', () => {
    render(<AnalysisReportCard {...defaultProps} />);

    // Should show at least some non-Documentation tools
    const nonDocTools = mockReport.techStack.tools.filter(t => t.category !== 'Documentation');
    if (nonDocTools.length > 0) {
      expect(screen.getByText(nonDocTools[0].name)).toBeDefined();
    }
  });

  it('calls onClick when card is clicked', () => {
    const onClick = mock(() => {});
    render(<AnalysisReportCard {...defaultProps} onClick={onClick} />);

    // Click on the card (the repo name area)
    fireEvent.click(screen.getByText(mockReport.basicStats.fullName));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked without triggering onClick', () => {
    const onClick = mock(() => {});
    const onDelete = mock(() => {});
    render(<AnalysisReportCard {...defaultProps} onClick={onClick} onDelete={onDelete} />);

    const deleteButton = screen.getByTitle('Clear report');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockReport.basicStats.fullName);
    // onClick should NOT be called due to stopPropagation
    expect(onClick).not.toHaveBeenCalled();
  });
});
