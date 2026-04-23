import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

const NetworkGraph = ({ users, influencerId, path = [] }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!users || users.length === 0) return;

    const nodes = new DataSet(
      users.map((user) => {
        let backgroundColor = '#00f5c4'; // Neon Teal
        let borderColor = '#00f5c4';
        let shadowColor = 'rgba(0, 245, 196, 0.5)';
        let size = 25;
        let fontSize = 12;

        if (user._id === influencerId) {
          backgroundColor = '#f59e0b'; // Amber
          borderColor = '#f59e0b';
          shadowColor = 'rgba(245, 158, 11, 0.6)';
          size = 35;
          fontSize = 14;
        }

        if (path && path.includes(user._id)) {
          backgroundColor = '#00f5c4';
          borderColor = '#ffffff';
          shadowColor = 'rgba(255, 255, 255, 0.8)';
          size = 30;
        }

        return {
          id: user._id,
          label: user.name,
          color: {
            background: '#0d1117',
            border: borderColor,
            highlight: { background: '#0d1117', border: '#ffffff' },
            hover: { background: '#1f2937', border: '#ffffff' }
          },
          font: { 
            color: '#ffffff', 
            size: fontSize, 
            face: 'JetBrains Mono',
            bold: true 
          },
          shape: 'circularPadding',
          size: size,
          shadow: {
            enabled: true,
            color: shadowColor,
            size: 15,
            x: 0,
            y: 0
          },
          borderWidth: 2,
          borderWidthSelected: 4
        };
      })
    );

    const edges = new DataSet();
    const processedPairs = new Set();

    users.forEach((user) => {
      user.connections.forEach((conn) => {
        const connId = conn._id || conn;
        const pair = [user._id, connId].sort().join('-');
        if (!processedPairs.has(pair)) {
          let color = 'rgba(0, 245, 196, 0.15)'; // Faint teal
          let width = 1;
          let shadow = false;

          // Highlight path edges
          if (path && path.includes(user._id) && path.includes(connId)) {
            const idx1 = path.indexOf(user._id);
            const idx2 = path.indexOf(connId);
            if (Math.abs(idx1 - idx2) === 1) {
              color = '#f59e0b'; // Amber for path
              width = 4;
              shadow = true;
            }
          }

          edges.add({
            from: user._id,
            to: connId,
            color: {
              color: color,
              highlight: '#00f5c4',
              hover: '#00f5c4',
              inherit: false
            },
            width: width,
            shadow: shadow ? { enabled: true, color: 'rgba(245, 158, 11, 0.5)', size: 10 } : false,
            smooth: {
               type: 'continuous',
               roundness: 0.5
            }
          });
          processedPairs.add(pair);
        }
      });
    });

    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 150,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 1
        },
      },
      interaction: {
        hover: true,
        dragNodes: true,
        zoomView: true,
        dragView: true
      },
      nodes: {
        scaling: {
          min: 20,
          max: 50
        }
      }
    };

    const network = new Network(containerRef.current, data, options);

    return () => {
      network.destroy();
    };
  }, [users, influencerId, path]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[500px]"
    />
  );
};

export default NetworkGraph;
