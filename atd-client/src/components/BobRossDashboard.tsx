import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import GeneralAppBar from './GeneralAppBar';
import GeneralTable, { IGeneralHeaderTableCell } from './GeneralTable';
import bobRossPageQuery from './../queries/bobRossPageQuery';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area
} from 'recharts';

const BobRossPageContainer = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 50% 50%;
  grid-template-rows: 40% 50%;
`;

const GraphsGrid = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
`;

const TableGrid = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
`;

const GraphsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
`;

const GraphTitleContainers = styled.div`
  display: flex;
  justify-content: space-around;
  h3 {
    margin-bottom: -15px;
  }
`;

const buildBobRossTableHeaderRows = (node: any): IGeneralHeaderTableCell[] => {
  return Object.keys(node).map((k: string) => {
    return {
      id: k,
      numeric: false,
      disablePadding: false,
      label: k.toUpperCase()
    };
  });
};

const buildBobRossTableDataRows = (nodes: any[]): { id: string }[] => {
  return nodes.map(node => {
    return {
      id: node.nodeId,
      ...node
    };
  });
};

class BobRossDashboard extends Component<{}, {}> {
  getPieEntriesWithCounts = (nodes: any[], greaterThanThreshold: number = 0) => {
    const paintingObjectKeys = Object.keys(nodes[0]);
    const totalBobRossObjectsCount = nodes.reduce((acc, nextNode) => {
      paintingObjectKeys.forEach(objKey => {
        if (typeof nextNode[objKey] == 'boolean' && nextNode[objKey] === true) {
          acc[objKey] = acc[objKey] ? acc[objKey] + 1 : 1;
        }
      });
      return acc;
    }, {});

    return Object.keys(totalBobRossObjectsCount)
      .map(objectKey => ({
        name: objectKey,
        value: totalBobRossObjectsCount[objectKey]
      }))
      .filter(mappedObject => mappedObject.value > greaterThanThreshold);
  };

  getAreaChartData = (nodes: any[]) => {
    const totalBobRossObjectsBySeason = nodes.reduce((acc, nextNode) => {
      // get episode object count
      const episodeObjectCount = Object.values(nextNode).filter(
        nodeVal => typeof nodeVal === 'boolean' && nodeVal === true
      ).length;
      const nextNodeSeason = nextNode.episode.substr(0, 3);

      acc[nextNodeSeason] = acc[nextNodeSeason]
        ? acc[nextNodeSeason] + episodeObjectCount
        : episodeObjectCount;

      return acc;
    }, {});

    return Object.keys(totalBobRossObjectsBySeason).map(seasonKey => ({
      name: seasonKey,
      value: totalBobRossObjectsBySeason[seasonKey]
    }));
  };

  getPieChartCellColor = (entry: any): string | null => {
    if (entry.value > 100) {
      return '#001F54';
    }
    if (entry.value > 150) {
      return '#0A1128';
    }
    return '#034078';
  };

  render() {
    return (
      <div>
        <GeneralAppBar />
        <Query query={bobRossPageQuery}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const bobRossData = data.allBobRosses.nodes;
            return (
              <BobRossPageContainer>
                <GraphsGrid>
                  <GraphTitleContainers>
                    <h3>Total Number of Times An Object is Drawn</h3>
                    <h3>Total Number of Objects within a Season</h3>
                  </GraphTitleContainers>
                  <GraphsContainer>
                    <ResponsiveContainer height="100%" width="100%">
                      <PieChart style={{ marginLeft: '-2em' }}>
                        <Pie
                          data={this.getPieEntriesWithCounts(bobRossData, 50)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {this.getPieEntriesWithCounts(bobRossData, 50).map(
                            (entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={this.getPieChartCellColor(entry)} />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer height="80%" width="80%">
                      <AreaChart
                        data={this.getAreaChartData(bobRossData)}
                        style={{ marginTop: '4em' }}
                      >
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </GraphsContainer>
                  <GraphTitleContainers />
                </GraphsGrid>
                <TableGrid>
                  <GeneralTable
                    tableTitle={"All Items in Bob Ross's Paintings"}
                    data={buildBobRossTableDataRows(bobRossData)}
                    headerRow={buildBobRossTableHeaderRows(bobRossData[0])}
                  />
                </TableGrid>
              </BobRossPageContainer>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default BobRossDashboard;
